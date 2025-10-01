<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Resources\FreelancerResource;
use App\Http\Resources\JobResource;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Job\JobInterface;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ApplicantViewController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected JobInterface $jobInterface,
    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index(string $id)
    {

        $job = JobResource::make($this->jobInterface->findByColumn(['id' => $id], ['*'], ['client']));

        // dd($proposal);
        return Inertia::render('Freelancer/Applicant/Show/Index', [
            'user' => FreelancerResource::make(Auth::user()),
            'job' => $job,
        ]);
    }
}
