<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\Project\ProjectInterface;
use App\Repositories\All\Review\ReviewInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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

    public function index(Request $request)
    {
        $offers = $this->offerInterface->getByColumn(['freelancer_id' => Auth::id(), 'status' => 'accepted'], ['*'], ['user', 'proposal', 'jobPost']);
        $completedOffers = $this->offerInterface->getByColumn(['freelancer_id' => Auth::id(), 'status' => 'completed'], ['*'], ['user', 'proposal', 'jobPost']);

        // dd($offers);
        return Inertia::render('Freelancer/Contract/All/Index', [
            'user' => Auth::user(),
            'offers' => $offers,
            'completedOffers' => $completedOffers,
        ]);
    }

    public function show(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id], ['*'], ['attachments', 'milestones', 'user']);
        // dd($offer);
        $project = $this->projectInterface->findByColumn(['offer_id' => $offer->id], ['*'], ['attachments']);
        // dd($project);
        $review = $this->reviewInterface->findByColumn(['offer_id' => $offer->id, 'user_id' => Auth::id()]);

        $recentActivity = $this->offerRecentActivityInterface->getByColumn(['offer_id' => $offer->id]);

        // dd($project);

        $completeMilestone = $this->offerMilestoneInterface->getByColumn(['offer_id' => $offer->id, 'status' => 'completed', 'project_status' => 'approved'], ['*'], ['attachments']);
        $pendingMilestone = $this->offerMilestoneInterface->getByColumn(['offer_id' => $offer->id, 'status' => 'active', 'project_status' => 'pending'], ['*'], ['attachments']);
        $currentMilestone = $this->offerMilestoneInterface->findByColumn(['offer_id' => $offer->id, 'status' => 'paid'], ['*'], ['attachments']);

        if ($currentMilestone == null && $pendingMilestone->count() > 0) {
            $currentMilestone = $pendingMilestone[0];
            $pendingMilestone = $pendingMilestone->slice(1)->values();
        }

        return Inertia::render('Freelancer/Contract/Show/Index', [
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
}
