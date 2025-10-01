<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Notifications\ProjectMarkedCompletedNotification\ProjectMarkedCompletedMilestoneNotification;
use App\Notifications\ProjectMarkedCompletedNotification\ProjectMarkedCompletedNotification;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\Project\ProjectInterface;
use App\Repositories\All\Review\ReviewInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class ContractsController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected ProjectInterface $projectInterface,
        protected ReviewInterface $reviewInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected OfferMilestoneAttachmentInterface $offerMilestoneAttachmentInterface,
        protected OfferRecentActivityInterface $offerRecentActivityInterface,
    ) {}

    public function show(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id], ['*'], ['milestones', 'freelancer', 'attachments']);
        $project = $this->projectInterface->findByColumn(['offer_id' => $offer->id], ['*'], ['attachments']);
        $review = $this->reviewInterface->findByColumn(['offer_id' => $offer->id, 'user_id' => Auth::id()]);
        $completeMilestone = $this->offerMilestoneInterface->getByColumn(['offer_id' => $offer->id, 'status' => 'completed', 'project_status' => 'approved'], ['*'], ['attachments']);
        $pendingMilestone = $this->offerMilestoneInterface->getByColumn(['offer_id' => $offer->id, 'status' => 'active', 'project_status' => 'pending'], ['*'], ['attachments']);
        $currentMilestone = $this->offerMilestoneInterface->findByColumn(['offer_id' => $offer->id, 'status' => 'paid'], ['*'], ['attachments']);

        if ($currentMilestone == null && $pendingMilestone->count() > 0) {
            $currentMilestone = $pendingMilestone[0];
            $pendingMilestone = $pendingMilestone->slice(1)->values();
        }
        $recentActivity = $this->offerRecentActivityInterface->getByColumn(['offer_id' => $offer->id]);

        // dd($currentMilestone);
        return Inertia::render('Client/Contract/Show/Index', [
            'offer' => $offer,
            'user' => Auth::user(),
            'project' => $project,
            'review' => $review,
            'completeMilestone' => $completeMilestone,
            'pendingMilestone' => $pendingMilestone,
            'currentMilestone' => $currentMilestone,
            'recentActivity' => $recentActivity,

        ]);
    }

    public function approveProject(int $id)
    {
        $project = $this->projectInterface->findById($id);
        $project->status = 'completed';
        $project->save();
        $this->reviewInterface->create(['offer_id' => $project->offer_id, 'user_id' => $project->client_id, 'reviewer_id' => $project->freelancer_id]);
        $this->reviewInterface->create(['offer_id' => $project->offer_id, 'user_id' => $project->freelancer_id, 'reviewer_id' => $project->client_id]);
        $this->offerRecentActivityInterface->create(['offer_id' => $project->offer_id, 'activity' => 'Project approved']);

        try {
            Notification::send($project->freelancer, new ProjectMarkedCompletedNotification($project->freelancer->first_name, $project->client->first_name, $project->contract_title));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('client.contracts.show', $project->offer_id)->with('success', 'Project Approved Successfully');
    }

    public function approveMilestoneProject(int $id)
    {
        $milestone = $this->offerMilestoneInterface->findById($id);
        $activeMilestones = $this->offerMilestoneInterface->getByColumn(['offer_id' => $milestone->offer_id, 'status' => 'active'])->count();
        $milestone->status = 'completed';
        $milestone->project_status = 'approved';
        $milestone->save();
        $this->offerRecentActivityInterface->create(['offer_id' => $milestone->offer_id, 'activity' => 'Milestone approved']);
        if ($activeMilestones == 0) {
            $offer = $this->offerInterface->findByUuId($milestone->offer_id);
            $this->reviewInterface->create(['offer_id' => $milestone->offer_id, 'user_id' => $offer->user_id, 'reviewer_id' => $offer->freelancer_id]);
            $this->reviewInterface->create(['offer_id' => $milestone->offer_id, 'user_id' => $offer->freelancer_id, 'reviewer_id' => $offer->user_id]);
        }
        try {
            Notification::send($milestone->freelancer, new ProjectMarkedCompletedMilestoneNotification($milestone->freelancer->first_name, $milestone->contract_title, $milestone->client->first_name));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('client.contracts.show', $milestone->offer_id)->with('success', 'Project Approved Successfully');
    }
}
