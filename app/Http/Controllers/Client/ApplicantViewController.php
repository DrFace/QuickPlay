<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Resources\FreelancerResource;
use App\Http\Resources\ProposalResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicantViewController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected JobCategoryInterface $jobCategoryInterface,
        protected JobInterface $jobInterface,
        protected ProposalInterface $proposalInterface,
        protected UserInterface $userInterface,
    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index(string $id)
    {

        $proposal = $this->proposalInterface->findByColumn(['id' => $id], ['*'], ['attachments', 'milestones']);
        $jobTitle = $this->jobInterface->findByColumn(['id' => $proposal->job_post_id], ['title'])->title;
        $freelancer = $this->userInterface->findByColumn(['id' => $proposal->user_id], ['*']);

        return Inertia::render('Client/Applicant/Show/Index', [
            'user' => Auth::user(),
            'proposal' => ProposalResource::make($proposal),
            'jobTitle' => $jobTitle,
            'freelancer' => FreelancerResource::make($freelancer),
        ]);
    }
}
