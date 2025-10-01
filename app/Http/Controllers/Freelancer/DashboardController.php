<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Resources\JobResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\UserJobCategory\UserJobCategoryInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class DashboardController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected JobInterface $jobInterface,
        protected SkillCategoryInterface $skillCategoryInterface,
        protected CreditInterface $creditInterface,
        protected UserJobCategoryInterface $userJobCategoryInterface,
    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 5;
        $filters['page'] = $filters['page'] ?? 1;

        $user = Auth::user();
        $jobs = JobResource::collection($this->jobInterface->filterWithParam($filters, ['client'], ['status' => 'active']));
        $jobSkills = $this->userJobCategoryInterface->getByColumn(['user_id' => $user->id], ['job_category_id', 'skills']);

        return Inertia::render('Freelancer/Dashboard/Index', [
            'user' => $user,
            'jobs' => $jobs,
            'filters' => $filters,
            'jobSkills' => $jobSkills,
        ]);
    }
}
