<?php

namespace App\Http\Controllers\Freelancer;

use App\Enums\MainStatusEnum;
use App\Enums\SkillCategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Languages\LanguageRequest;
use App\Http\Requests\Portfolio\PortfolioDraftRequest;
use App\Http\Requests\Portfolio\PortfolioRequest;
use App\Http\Requests\Portfolio\PortfolioUpdateDraftRequest;
use App\Http\Requests\Portfolio\PortfolioUpdateRequest;
use App\Http\Requests\Profile\EducationRequest;
use App\Http\Requests\Profile\ProfileOverviewRequest;
use App\Http\Requests\Profile\UpdateYoutubeRequest;
use App\Http\Traits\UtilityTrait;
use App\Models\JobPost;
use App\Notifications\AppNotification\CreateNotification;
use App\Notifications\AppNotification\DeleteNotification;
use App\Notifications\AppNotification\UpdateNotification;
use App\Repositories\All\Education\EducationInterface;
use App\Repositories\All\EmployHistory\EmployHistoryInterface;
use App\Repositories\All\FavoriteJob\FavoriteJobInterface;
use App\Repositories\All\Language\LanguageInterface;
use App\Repositories\All\Portfolio\PortfolioInterface;
use App\Repositories\All\Review\ReviewInterface;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\User\UserInterface;
use App\Services\LanguagesService\LanguagesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ProfileController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected PortfolioInterface $portfolioInterface,
        protected UserInterface $userInterface,
        protected EducationInterface $educationInterface,
        protected LanguagesService $languagesService,
        protected LanguageInterface $languageInterface,
        protected SkillCategoryInterface $skillCategoryInterface,
        protected FavoriteJobInterface $FavoriteJobsInterface,
        protected EmployHistoryInterface $EmployHistoryInterface,
        protected ReviewInterface $reviewInterface,

    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index()
    {
        $ActivePortfolios = $this->portfolioInterface->getByColumn(['user_id' => Auth::id(), 'status' => MainStatusEnum::Active->value]);
        $draftPortfolios = $this->portfolioInterface->getByColumn(['user_id' => Auth::id(), 'status' => MainStatusEnum::Draft->value]);
        $employmentHistory = $this->EmployHistoryInterface->getByColumn(['user_id' => Auth::id()]);
        $reviews = $this->reviewInterface->getByColumn(['reviewer_id' => Auth::id(), 'status' => 'submitted'], ['*'], ['offer']);

        return Inertia::render('Freelancer/Profile/Index', [
            'user' => Auth::user(),
            'activePortfolios' => $ActivePortfolios,
            'draftPortfolios' => $draftPortfolios,
            'educations' => $this->educationInterface->getByColumn(['user_id' => Auth::id()]),
            'languages' => $this->languagesService->getLanguages(),
            'userLanguages' => $this->languageInterface->getByColumn(['user_id' => Auth::id()]),
            'skillsOptions' => $this->skillCategoryInterface->getByColumn(['status' => SkillCategoryStatusEnum::Active->value], ['id as value', 'name as label']),
            'userSkills' => json_encode(Auth::user()->skills),
            'reviews' => $reviews,
            'employmentHistory' => $employmentHistory,
        ]);
    }

    /**
     * Method portfolio
     *
     * @return void
     */
    public function storePortfolio(PortfolioRequest $request)
    {
        $data = $request->all();
        if ($request->hasFile('image')) {
            $path = $data['image']->store('portfolio', 'public');
            $data['image'] = $path;
        }
        $this->portfolioInterface->create([
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'role' => $data['role'],
            'skills' => $data['skills'],
            'description' => $data['description'],
            'image' => $data['image'],
            'status' => MainStatusEnum::Active->value,
        ]);

        return redirect()->back()->with('success', 'Portfolio Added Successfully');
    }

    /**
     * Method draftPortfolio
     *
     * @return void
     */
    public function storeDraftPortfolio(PortfolioDraftRequest $request)
    {
        $data = $request->all();
        if ($request->hasFile('image')) {
            $path = $data['image']->store('portfolio', 'public');
            $data['image'] = $path;
        }
        $this->portfolioInterface->create([
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'role' => $data['role'],
            'skills' => $data['skills'],
            'description' => $data['description'],
            'image' => $data['image'],
            'status' => MainStatusEnum::Draft->value,
        ]);

        return redirect()->back()->with('success', 'Portfolio Saved as Draft');
    }

    /**
     * Method portfolio
     *
     * @return void
     */
    public function deletePortfolio(int $id)
    {
        $this->portfolioInterface->deleteById($id);

        return redirect()->back()->with('success', 'Portfolio Deleted Successfully');
    }

    /**
     * Method publishPortfolioPortfolio
     *
     * @return void
     */
    public function publishPortfolio(int $id, PortfolioRequest $request)
    {

        $data = $request->all();
        $portfolio = $this->portfolioInterface->findById($id);
        if ($request->hasFile('image')) {
            $path = $data['image']->store('portfolio', 'public');
            $data['image'] = $path;
        }
        $portfolio->update([
            'title' => $data['title'],
            'role' => $data['role'],
            'skills' => $data['skills'],
            'description' => $data['description'],
            'image' => $data['image'],
        ]);

        $portfolio = $this->portfolioInterface->findById($id);
        $portfolio->status = MainStatusEnum::Active->value;
        $portfolio->save();

        return redirect()->back()->with('success', 'Portfolio Published Successfully');
    }

    /**
     * Method updatePortfolio
     *
     * @return void
     */
    public function updatePortfolio(int $id, PortfolioUpdateRequest $request)
    {
        $data = $request->all();
        $portfolio = $this->portfolioInterface->findById($id);
        if ($request->hasFile('image')) {
            $path = $data['image']->store('portfolio', 'public');
            $data['image'] = $path;
        }
        $portfolio->update([
            'title' => $data['title'],
            'role' => $data['role'],
            'skills' => $data['skills'],
            'description' => $data['description'],
            'image' => $data['image'],
        ]);

        return redirect()->back()->with('success', 'Portfolio Updated Successfully');
    }

    /**
     * Method updateDraftPortfolio
     *
     * @return void
     */
    public function updateDraftPortfolio(int $id, PortfolioUpdateDraftRequest $request)
    {
        $data = $request->all();
        $portfolio = $this->portfolioInterface->findById($id);
        if ($request->hasFile('image')) {
            $path = $data['image']->store('portfolio', 'public');
            $data['image'] = $path;
        }
        $portfolio->update([
            'title' => $data['title'],
            'role' => $data['role'],
            'skills' => $data['skills'],
            'description' => $data['description'],
            'image' => $data['image'],
        ]);

        return redirect()->back()->with('success', 'Portfolio Draft Updated Successfully');
    }

    public function updateTitle(Request $request)
    {
        // dd($request->all());
        $data = $request->all();
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        $user->setMeta($data);
        $user->save();
        $data = 'Title';
        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', 'Title Updated Successfully');
    }

    public function updateProfileOverview(ProfileOverviewRequest $request)
    {
        $data = $request->all();

        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        $user->setMeta($data);
        $user->save();

        return redirect()->back()->with('success', 'Profile Overview Updated Successfully');
    }

    public function updateYoutube(UpdateYoutubeRequest $request)
    {
        $data = $request->validated();
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);

        $user->setMeta($data);
        $user->save();

        return redirect()->back()->with('success', 'YouTube Link Updated Successfully');
    }

    public function storeEducation(EducationRequest $request)
    {

        $this->educationInterface->create([
            'user_id' => Auth::id(),
            'school' => $request->school,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'degree' => $request->degree,
            'area_of_study' => $request->area_of_study,
            'description' => $request->description,
        ]);
        $data = 'Education';
        $user = Auth::user();
        try {
            Notification::send($user, new CreateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', 'Education Added Successfully');
    }

    public function updateEducation(Request $request, int $id)
    {
        $education = $this->educationInterface->findById($id);
        $education->update([
            'school' => $request->school,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'degree' => $request->degree,
            'area_of_study' => $request->area_of_study,
            'description' => $request->description,
        ]);
        $data = 'Education';
        $user = Auth::user();

        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', 'Education Updated Successfully');
    }

    public function deleteEducation(int $id)
    {
        $this->educationInterface->deleteById($id);
        $data = 'Education';
        $user = Auth::user();
        try {
            Notification::send($user, new DeleteNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', 'Education Deleted Successfully');
    }

    public function storeLanguage(LanguageRequest $request)
    {
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        $this->languageInterface->create(
            [
                'user_id' => Auth::id(),
                'language' => $request->language,
                'level' => $request->level,
            ]);

        return redirect()->back()->with('success', 'Language Added Successfully');
    }

    public function deleteLanguage(int $id)
    {
        $this->languageInterface->deleteById($id);

        return redirect()->back()->with('success', 'Language Deleted Successfully');
    }

    public function updateSkills(Request $request)
    {
        // dd($request->all());
        $data = $request->all();
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        $user->skills = json_encode($data['skills']);
        $user->save();

        return redirect()->back()->with('success', 'Skills Updated Successfully');
    }

    public function addFavoriteJobs(Request $request)
    {
        $request->validate([
            'user_id' => 'required|uuid|exists:users,id',
            'job_id' => 'required|uuid|exists:job_posts,id',
        ]);

        $jobPost = JobPost::find($request->job_id);
        $existingFavorite = $this->FavoriteJobsInterface->findByColumn([
            'user_id' => $request->user_id,
            'job_id' => $request->job_id,
        ]);

        if ($existingFavorite) {
            $this->FavoriteJobsInterface->deleteById($existingFavorite->id);
            $status = 'removed';
        } else {
            $this->FavoriteJobsInterface->create([
                'user_id' => $request->user_id,
                'job_id' => $request->job_id,
            ]);
            $status = 'added';
        }

        $jobPost->refresh();

        return redirect()->back()->with([
            'status' => $status,
            'is_favorite' => $jobPost->is_favorite,
            'success' => $status === 'added' ? 'Job Added to Favorites Successfully' : 'Job Removed from Favorites Successfully',
        ]);
    }

    public function addEmployHistory(Request $request)
    {
        $validatedData = $request->validate([
            'company_name' => 'required|string|max:150',
            'position' => 'required|string|max:155',
            'currently_working' => 'boolean',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
        ]);

        $validatedData['user_id'] = Auth::id();

        $employ_history = $this->EmployHistoryInterface->create($validatedData);

        return redirect()->back()->with([
            'success' => 'Employment History Added Successfully.',
            'employ_history' => $employ_history,
        ], 201);
    }

    public function deleteEmployHistory(int $id)
    {
        $this->EmployHistoryInterface->deleteById($id);

        return redirect()->back()->with('success', 'Employment History Deleted Successfully');
    }

    public function freelancerShow($id)
    {
        $user = $this->userInterface->findByUuId($id);
        $ActivePortfolios = $this->portfolioInterface->getByColumn(['user_id' => $id, 'status' => MainStatusEnum::Active->value]);
        $employmentHistory = $this->EmployHistoryInterface->getByColumn(['user_id' => $id]);
        $reviews = $this->reviewInterface->getByColumn(['reviewer_id' => $id, 'status' => 'submitted'], ['*'], ['offer']);

        return Inertia::render('Freelancer/PublicView/Index', [
            'user' => $user,
            'activePortfolios' => $ActivePortfolios,
            'educations' => $this->educationInterface->getByColumn(['user_id' => $id]),
            'userLanguages' => $this->languageInterface->getByColumn(['user_id' => $id]),
            'reviews' => $reviews,
            'employmentHistory' => $employmentHistory,
        ]);
    }
}
