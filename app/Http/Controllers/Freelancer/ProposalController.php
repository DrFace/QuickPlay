<?php

namespace App\Http\Controllers\Freelancer;

use App\Enums\MainStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Proposal\ProposalRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\CreateNotification;
use App\Notifications\AppNotification\DeleteNotification;
use App\Notifications\AppNotification\PublicNotification;
use App\Notifications\AppNotification\UpdateNotification;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\JobCategory\JobCategoryInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\ProposalAttachment\ProposalAttachmentInterface;
use App\Repositories\All\ProposalMilestone\ProposalMilestoneInterface;
use DateTime;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ProposalController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected JobInterface $jobInterface,
        protected JobCategoryInterface $jobCategoryInterface,
        protected ProposalInterface $proposalInterface,
        protected ProposalAttachmentInterface $proposalAttachmentInterface,
        protected ProposalMilestoneInterface $proposalMilestoneInterface,
        protected CreditInterface $creditInterface
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $submittedProposals = $this->proposalInterface->getByColumn(['user_id' => Auth::user()->id, 'proposal_status' => 'submitted', 'status' => 'active'], ['*'], ['job']);
        $offeredProposals = $this->proposalInterface->getByColumn(['user_id' => Auth::user()->id, 'proposal_status' => 'offered', 'status' => 'active'], ['*'], ['job']);
        $activeProposals = $this->proposalInterface->getByColumn(['user_id' => Auth::user()->id, 'proposal_status' => 'active', 'status' => 'active'], ['*'], ['job']);

        // dd($submittedProposals);
        return Inertia::render(
            'Freelancer/Proposals/All/Index',
            [
                'user' => Auth::user(),
                'submittedProposals' => $submittedProposals,
                'activeProposals' => $activeProposals,
                'offeredProposals' => $offeredProposals,
            ]
        );
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(string $jobId)
    {
        $job = $this->jobInterface->findByUuId($jobId, ['title', 'id', 'description', 'category_id', 'skills', 'budget', 'scope_experience', 'scope_duration'], ['attachments']);

        return Inertia::render(
            'Freelancer/Proposals/Create/Index',
            [
                'user' => Auth::user(),
                'type' => 'create',
                'job' => $job,
            ]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(ProposalRequest $request)
    {

        // dd($request->all());
        $data = $request->all();
        if ($data['type'] == 'create') {

            $requiredConnects = 15;
            $connects = $this->creditInterface->getByColumn(['user_id' => Auth::id(), 'status' => 'active']);
            $connectsCount = 0;
            if ($connects) {
                $connectsCount = $connects->sum('available_connects');
            }
            if ($connectsCount < $requiredConnects) {
                return redirect()->back()->with('error', 'You do not have enough connects to submit a proposal');
            }
            foreach ($connects as $connect) {
                if ($requiredConnects <= 0) {
                    break;
                }
                if ($connect->available_connects <= $requiredConnects) {
                    $requiredConnects -= $connect->available_connects;
                    $connect->status = 'inactive';
                    $connect->available_connects = 0;
                    $connect->save();
                } else {
                    $connect->available_connects -= $requiredConnects;
                    $connect->save();
                    $requiredConnects = 0;
                }
            }

            $proposal = $this->proposalInterface->create([
                'job_post_id' => $data['job_id'],
                'user_id' => Auth::user()->id,
                'paid_type' => $data['paidType'] == 'Milestone' ? 'by_milestone' : 'by_project',
                'bid_amount' => $data['bid_amount'],
                'service_fee' => $data['service_fee'],
                'receive_amount' => $data['amount_received'],
                'duration' => $data['duration'],
                'description' => $data['description'],
                'status' => MainStatusEnum::Active->value,
            ]);
        } else {
            $proposal = $this->proposalInterface->findByColumn(['job_post_id' => $data['job_id'], 'user_id' => Auth::user()->id]);
            $proposal->update([
                'paid_type' => $data['paidType'] == 'Milestone' ? 'by_milestone' : 'by_project',
                'bid_amount' => $data['bid_amount'],
                'service_fee' => $data['service_fee'],
                'receive_amount' => $data['amount_received'],
                'duration' => $data['duration'],
                'description' => $data['description'],
                'status' => MainStatusEnum::Active->value,
            ]);
        }

        $attachments = $this->proposalAttachmentInterface->getByColumn(['proposal_id' => $proposal->id]);

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
                    $path = $file->store('proposal', 'public');
                    $this->proposalAttachmentInterface->create([
                        'proposal_id' => $proposal->id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        $this->proposalMilestoneInterface->getByColumn(['proposal_id' => $proposal->id])->each->delete();

        if ($data['paidType'] == 'Milestone') {
            foreach ($data['milestones'] as $milestone) {
                $this->proposalMilestoneInterface->create([
                    'proposal_id' => $proposal->id,
                    'due_date' => $milestone['dueDate'],
                    'description' => $milestone['description'],
                    'amount' => $milestone['amount'],
                    'status' => MainStatusEnum::Active->value,
                ]);

            }
        }

        if ($data['type'] == 'create') {
            $data = 'Proposal';
            try {
                Notification::send($proposal->freelancer, new CreateNotification($data));
            } catch (\Exception $e) {
                return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
            }
            $data1 = 'Proposal Received from '.$proposal->freelancer->first_name;
            $job = $this->jobInterface->findByUuid($proposal->job_post_id, ['*'], ['client']);
            try {
                Notification::send($job->client, new PublicNotification($data1));

            } catch (\Exception $e) {
                return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
            }

            return redirect()->route('freelancer.proposals.show', $proposal->id)->with('success', ['Proposal Submitted Successfully', $this->randomKey()]);
        }

        $data = 'Proposal';
        try {
            Notification::send($proposal->freelancer, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('freelancer.proposals.show', $proposal->id)->with('success', ['Proposal Updated Successfully', $this->randomKey()]);
    }

    /**
     * Display the specified resource.
     */
    public function show($proposal)
    {

        $proposal = $this->proposalInterface->findByColumn(['id' => $proposal], ['*'], ['job', 'attachments', 'milestones']);

        // $jobCategory = $this->jobCategoryInterface->findByColumn(['id' => $proposal->job->category_id]);
        // dd($jobCategory->name);
        // $proposal['job']['category'] = $jobCategory->name;
        // $proposal['job']['skills'] = json_decode($proposal->job->skills);

        return Inertia::render('Freelancer/Proposals/Show/Index', [
            'proposal' => $proposal,
            'user' => Auth::user(),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $proposal = $this->proposalInterface->findByColumn(['id' => $id], ['*'], ['job', 'attachments', 'milestones']);
        $proposal['job']['skills'] = json_decode($proposal->job->skills);
        $proposal['job']['category'] = $this->jobCategoryInterface->findByColumn(['id' => $proposal->job->category_id])->name;

        $milestones = [];
        foreach ($proposal->milestones as $milestone) {
            $milestones[] = [
                'description' => $milestone->description,
                'dueDate' => (new DateTime($milestone->due_date))->format('Y-m-d'),
                'amount' => $milestone->amount,
            ];
        }

        $proposal['list'] = $milestones;

        // dd($proposal);
        return Inertia::render('Freelancer/Proposals/Create/Index', [
            'job' => $proposal->job,
            'proposal' => $proposal,
            'type' => 'edit',
            'user' => Auth::user(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        // dd($request->all());
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * Withdraw the specified proposal and restore connects.
     */
    public function destroy(string $id)
    {
        $proposal = $this->proposalInterface->findByColumn(['id' => $id, 'user_id' => Auth::id()]);

        if (! $proposal) {
            return redirect()->back()->with('error', 'Proposal not found or you are not authorized to delete this proposal.');
        }

        $requiredConnects = 15;

        $credits = $this->creditInterface->getByColumn(['user_id' => Auth::id()]);

        foreach ($credits as $credit) {

            if ($credit->status == 'active') {
                $credit->update(['available_connects' => $credit->available_connects + $requiredConnects]);

                $proposal->delete();
                $data = 'Proposal';
                try {
                    Notification::send($proposal->freelancer, new DeleteNotification($data));
                } catch (\Exception $e) {
                    return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
                }

                return redirect()->route('freelancer.proposals.index')->with('success', 'Proposal Deleted and Connects Restored Successfully.');
            }

        }
    }
}
