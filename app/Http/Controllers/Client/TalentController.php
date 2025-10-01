<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\FreelancerResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Education\EducationInterface;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\Language\LanguageInterface;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TalentController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected EducationInterface $EducationInterface,
        protected LanguageInterface $languageInterface,
        protected UserInterface $userInterface,
        protected SkillCategoryInterface $skillCategoryInterface,
        protected JobCategoryInterface $jobCategoryInterface,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        // dd($request->all());

        $filters = $request->only('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'skillCategories', 'jobCategories', 'minRate', 'maxRate', 'user_type');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['user_type'] = 'freelancer';

        return Inertia::render('Client/Talent/All/Index', [
            'user' => Auth::user(),
            'filters' => $filters,
            'freelancers' => FreelancerResource::collection($this->userInterface->filterWithParam($filters, [])),
            'skillCategories' => $this->skillCategoryInterface->getByColumn(['status' => 'active'], ['id as value', 'name as label']),
            'jobCategories' => $this->jobCategoryInterface->getByColumn(['status' => 'active'], ['id as value', 'name as label']),
        ]);

    }

    public function freelancerShow($id)
    {
        $freelancer = $this->userInterface->findByColumn(['id' => $id]);
        $languages = $this->languageInterface->findByColumn(['user_id' => $id]);
        $education = $this->EducationInterface->findByColumn(['user_id' => $id]);

        return Inertia::render('Client/Talent/Show/Index', [
            'freelancer' => $freelancer,
            'languages' => $languages,
            'education' => $education,
        ]);
    }
}
