<?php

namespace App\Http\Controllers\Freelancer;

use App\Enums\MainStatusEnum;
use App\Enums\SkillCategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdatePreferenceRequest;
use App\Http\Requests\Account\UpdateProfileExperienceRequest;
use App\Http\Requests\Account\UpdateProfileJobCategoryRequest;
use App\Http\Requests\Account\UpdateProfileVisibilityRequest;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\PaymentMethod\PaymentMethodInterface;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\User\UserInterface;
use App\Repositories\All\UserJobCategory\UserJobCategoryInterface;
use App\Services\BankNameService\BankNameService;
use App\Services\CountryService\CountryService;
use App\Services\TimeZoneService\TimeZoneService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AccountSettingController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected JobCategoryInterface $jobCategoryInterface,
        protected SkillCategoryInterface $skillCategoryInterface,
        protected CountryService $CountryService,
        protected TimeZoneService $TimeZoneService,
        protected CreditInterface $creditInterface,
        protected UserJobCategoryInterface $userJobCategoryInterface,
        protected BankNameService $bankNameService,
        protected PaymentMethodInterface $paymentMethodInterface
    ) {}

    public function index()
    {
        $countries = $this->CountryService->getCountries();
        $timeZoneOptions = $this->TimeZoneService->getTimeZones();
        $user = Auth::user();
        $credits = $this->creditInterface->getByColumn(['user_id' => $user->id], ['connects', 'available_connects', 'expire_date', 'amount', 'tax', 'status']);
        $bankNames = $this->bankNameService->getAllBankNames();
        $bankAddress = $this->bankNameService->getAllBankAddress();
        $jobSkills = $this->userJobCategoryInterface->getByColumn(['user_id' => $user->id], ['job_category_id', 'skills', 'id']);
        $paymentMethod = $this->paymentMethodInterface->getByColumn(['user_id' => $user->id], ['id', 'account_holder_name', 'account_number', 'iban_number', 'country', 'bank_name', 'bank_address']);

        // dd( $credits);
        return Inertia::render('Freelancer/Account/Index', [
            'user' => $user,
            'countryMap' => $countries,
            'timeZoneOptions' => $timeZoneOptions,
            'jobCategories' => $this->jobCategoryInterface->getByColumn(['status' => MainStatusEnum::Active->value], ['id as value', 'name as label']),
            'skillsOptions' => $this->skillCategoryInterface->getByColumn(['status' => SkillCategoryStatusEnum::Active->value], ['id as value', 'name as label']),
            'credits' => $credits,
            'jobSkills' => $jobSkills,
            'bankNames' => $bankNames,
            'bankAddress' => $bankAddress,
            'paymentMethod' => $paymentMethod,

        ]);
    }

    public function updateProfileVisibilityInfo(UpdateProfileVisibilityRequest $request)
    {
        $data = $request->all();
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->setMeta('visibility', $data['visibility']);
        $user->save();

        return redirect()->back()->with('success', ['Visibility Updated Successfully.', $this->randomKey()]);
    }

    public function updateProfileInfo(UpdatePreferenceRequest $request)
    {
        $data = $request->all();
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->setMeta('project_preference', $data['project_preference']);
        $user->save();

        return redirect()->back()->with('success', ['Profile Information Updated Successfully.', $this->randomKey()]);
    }

    public function updateProfileExperienceInfo(UpdateProfileExperienceRequest $request)
    {
        $data = $request->all();
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->setMeta('experience_level', $data['experience_level']);
        $user->save();

        return redirect()->back()->with('success', ['Experience Level Updated Successfully.', $this->randomKey()]);
    }

    public function updateJobCategoryInfo(UpdateProfileJobCategoryRequest $request)
    {
        $data = $request->all();
        $skillIds = $data['skills'] ?? [];
        $skillNames = [];
        foreach ($skillIds as $skillId) {
            $skill = $this->skillCategoryInterface->getByColumn(['id' => $skillId], ['name'])->first();
            if ($skill) {
                $skillNames[] = $skill->name;
            }
        }
        $data['user_id'] = Auth::id();
        $data['job_category_id'] = $data['job_category'];
        $data['skills'] = json_encode($skillNames);
        $this->userJobCategoryInterface->create($data);

        return redirect()->back()->with('success', ['Job Category and Skills Added Successfully.', $this->randomKey()]);
    }

    public function deleteJobCategoryInfo(int $id)
    {
        $category = $this->userJobCategoryInterface->findByColumn(['id' => $id]);
        $category->delete();

        return redirect()->back()->with('success', ['Job category and Skills Deleted Successfully.', $this->randomKey()]);
    }
}
