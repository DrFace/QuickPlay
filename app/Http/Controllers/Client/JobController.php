<?php

namespace App\Http\Controllers\Client;

use App\Enums\MainStatusEnum;
use App\Enums\SkillCategoryStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Job\JobPostRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\JobResource;
use App\Http\Resources\ProposalResource;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\DeleteNotification;
use App\Notifications\AppNotification\UpdateNotification;
use App\Repositories\All\Chat\ChatInterface;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\JobAttachment\JobAttachmentInterface;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\SkillCategory\SkillCategoryInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class JobController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected JobCategoryInterface $jobCategoryInterface,
        protected JobInterface $jobInterface,
        protected JobAttachmentInterface $jobAttachmentInterface,
        protected ProposalInterface $proposalInterface,
        protected SkillCategoryInterface $skillCategoryInterface,
        protected OfferInterface $offerInterface,
        protected UserInterface $userInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected ChatInterface $chatInterface,

    ) {}

    /**
     * Method create
     *
     * @return void
     */
    public function create()
    {
        $job = $this->jobInterface->findByColumn(['status' => 'draft', 'user_id' => null]);
        if (! $job) {
            $job = $this->jobInterface->create([
                'status' => 'draft',
            ]);
        }
        $job->update([
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // dd($job);
        return Inertia::render('Client/Job/Edit/Index', [
            'jobPost' => $job,
            'type' => 'create',
            'user' => Auth::user(),
            'categories' => $this->jobCategoryInterface->getByColumn(['status' => MainStatusEnum::Active->value], ['id as value', 'name as label']),
            'skillsOptions' => $this->skillCategoryInterface->getByColumn(['status' => SkillCategoryStatusEnum::Active->value], ['id as value', 'name as label']),
        ]);
    }

    /**
     * Method edit
     *
     * @return void
     */
    public function edit($job)
    {
        $job = $this->jobInterface->findByColumn(['id' => $job], ['*'], ['attachments']);
        $job['skills'] = json_decode($job['skills'], true);

        return Inertia::render('Client/Job/Edit/Index', [
            'jobPost' => $job,
            'type' => 'edit',
            'user' => Auth::user(),
            'categories' => $this->jobCategoryInterface->getByColumn(['status' => MainStatusEnum::Active->value], ['id as value', 'name as label']),
            'skillsOptions' => $this->skillCategoryInterface->getByColumn(['status' => SkillCategoryStatusEnum::Active->value], ['id as value', 'name as label']),
        ]);
    }

    /**
     * Method job
     *
     * @return void
     */
    public function jobUpdate(JobPostRequest $request, string $job)
    {
        // dd($request->all());
        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['status'] = MainStatusEnum::Active->value;
        $jobRecord = $this->jobInterface->findByColumn(['id' => $job]);
        $attachments = $this->jobAttachmentInterface->getByColumn(['job_post_id' => $jobRecord->id]);

        foreach ($attachments as $attachment) {
            if ($request->attachments == null) {
                $attachment->delete();
            } elseif (! in_array($attachment->id, array_column($request->attachments, 'id'))) {
                $attachment->delete();
            }
        }

        if ($request->attachments != null) {
            foreach ($request->attachments as $file) {
                if (! is_array($file)) {
                    $path = $file->store('job', 'public');
                    $this->jobAttachmentInterface->create([
                        'job_post_id' => $jobRecord->id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        $jobRecord->update($data);
        $data = 'Job';

        $user = $this->userInterface->findByColumn(['id' => $jobRecord->user_id]);
        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('client.job.show', ['job' => $job])->with('success', ['Job Updated Successfully', $this->randomKey()]);
    }

    /**
     * Method job
     *
     * @return void
     */
    public function updateDraft(Request $request, string $job)
    {
        $data = $request->all();
        $data['user_id'] = Auth::id();
        $data['status'] = MainStatusEnum::Draft->value;
        $jobRecord = $this->jobInterface->findByColumn(['id' => $job]);
        $attachments = $this->jobAttachmentInterface->getByColumn(['job_post_id' => $jobRecord->id]);

        foreach ($attachments as $attachment) {
            if ($request->attachments == null) {
                $attachment->delete();
            } elseif (! in_array($attachment->id, array_column($request->attachments, 'id'))) {
                $attachment->delete();
            }
        }

        if ($request->attachments != null) {
            foreach ($request->attachments as $file) {
                if (! is_array($file)) {
                    $path = $file->store('job', 'public');
                    $this->jobAttachmentInterface->create([
                        'job_post_id' => $jobRecord->id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        $jobRecord->update($data);

        return redirect()->route('client.job.all')->with('success', ['Draft Updated Successfully', $this->randomKey()]);
    }

    /**
     * Method job
     *
     * @return void
     */
    public function show(string $id, Request $request)
    {
        // dd($request->all());
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 5;
        $filters['sortType'] = $filters['sortType'] ?? 'all';

        $job = $this->jobInterface->findByColumn(['id' => $id], ['*'], ['attachments']);
        $chat = $this->chatInterface->getByColumn(['job_post_id' => $job->id, 'client_id' => Auth::id()], ['proposal_id']);
        if ($chat->isEmpty() == false) {
            foreach ($chat as $key => $value) {
                $chatProposals[] = $this->proposalInterface->findByColumn(['id' => $value->proposal_id], ['*'], ['freelancer', 'attachments', 'milestones']);
            }
        } else {
            $chatProposals = [];
        }

        return Inertia::render('Client/Job/Show/Index', [
            'filters' => $filters,
            'user' => ClientResource::make(Auth::user()),
            'job' => JobResource::make($job),
            'proposals' => ProposalResource::collection($this->proposalInterface->filterWithParam($filters, ['freelancer', 'attachments', 'milestones'], ['job_post_id' => $job->id, 'proposal_status' => 'submitted'])),
            'hireProposals' => ProposalResource::make($this->proposalInterface->getByColumn(['job_post_id' => $job->id], ['*'], ['freelancer'], ['attachments', 'milestones'])->where('proposal_status', '!=', 'submitted')),
            'chatProposals' => $chatProposals,
        ]);
    }

    /**
     * Method job
     *
     * @return void
     */
    public function delete(string $job)
    {
        $this->jobInterface->findByColumn(['id' => $job])->delete();

        $data = 'Job';
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        try {
            Notification::send($user, new DeleteNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('client.job.all')->with('success', ['Job Deleted Successfully', $this->randomKey()]);
    }

    /**
     * Method allJobs
     *
     * @return void
     */
    public function allJobs(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'sortType');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 5;
        $filters['sortType'] = $filters['sortType'] ?? 'all-jobs';

        return Inertia::render('Client/Job/All/Index', [
            'user' => Auth::user(),
            'jobs' => JobResource::collection($this->jobInterface->filterWithParam($filters, ['proposals'], ['user_id' => Auth::id()])),
            'filters' => $filters,
            'offers' => $this->offerInterface->getByColumn(['user_id' => Auth::id(), 'status' => 'accepted'], ['*'], ['proposal', 'jobPost']),
            'completedOffers' => $this->offerInterface->getByColumn(['user_id' => Auth::id(), 'status' => 'completed'], ['*'], ['proposal', 'jobPost']),
        ]);
    }

    public function showJob($job)
    {
        // dd($job);
        if (! Auth::check()) {
            return redirect()->route('register');
        } elseif (Auth::user()->user_type == 'freelancer') {
            return redirect()->route('freelancer.applicant.show', ['job' => $job]);
        } elseif (Auth::user()->user_type == 'client') {
            $jobPost = $this->jobInterface->findByColumn(['id' => $job]);
            if ($jobPost) {
                if ($jobPost->user_id = Auth::id()) {
                    return redirect()->route('client.job.show', ['job' => $job]);
                } else {
                    return Inertia::render('Client/JobView/Index', [
                        'job' => $this->jobInterface->findByColumn(['id' => $job], ['*'], ['client']),
                    ]);
                }
            }
        } elseif (Auth::user()->user_type == 'admin') {
            return Inertia::render('Admin/JobView/Index', [
                'job' => $this->jobInterface->findByColumn(['id' => $job], ['*'], ['client']),
            ]);
        }
    }

    public function hire(string $id)
    {

        $offer = $this->offerInterface->findByColumn(['id' => $id, 'user_id' => Auth::id()]);
        $proposal = $this->proposalInterface->findByColumn(['id' => $offer->proposal_id]);
        $freelancer = $this->userInterface->findByColumn(['id' => $proposal->user_id]);
        $job = $this->jobInterface->findByColumn(['id' => $proposal->job_post_id]);

        if ($offer) {
            if ($offer->payment_type === 'Milestone') {
                $milestone = $this->offerMilestoneInterface->findByColumn(['offer_id' => $offer->id, 'status' => 'active']);
                $price = $milestone->amount;
            } else {
                $price = $offer->offer_price;
            }
        }

        // dd($id);
        return Inertia::render('Client/Job/Hire/Index', [
            'user' => Auth::user(),
            'price' => $price,
            'freelancer' => $freelancer,
            'job' => $job,
            'offer' => $offer,
        ]);
    }
}
