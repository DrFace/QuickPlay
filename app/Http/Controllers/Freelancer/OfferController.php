<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\DeleteNotification;
use App\Notifications\AppNotification\PublicNotification;
use App\Notifications\SendAndOffer\JobOfferSentToFreelancer;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferAttachment\OfferAttachmentInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\Project\ProjectInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class OfferController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected ProposalInterface $proposalInterface,
        protected JobInterface $jobInterface,
        protected ProjectInterface $projectInterface,
        protected OfferAttachmentInterface $offerAttachmentInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected OfferRecentActivityInterface $offerRecentActivityInterface,
    ) {}

    public function show(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id], ['*'], ['attachments', 'milestones', 'user']);

        return Inertia::render('Freelancer/Offer/Show/Index', [
            'offer' => $offer,
            'user' => Auth::user(),
        ]);
    }

    public function accept(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id]);

        $proposal = $this->proposalInterface->findByColumn(['id' => $offer->proposal_id]);
        $offer->update(['status' => 'accepted']);
        $proposal->update(['proposal_status' => 'active']);

        if ($offer->payment_type == 'Project') {
            $this->projectInterface->Create([
                'offer_id' => $offer->id,
                'client_id' => $offer->user_id,
                'freelancer_id' => $offer->freelancer_id,
                'status' => 'draft',
            ]);
        }

        try {
            Notification::send($offer->user, new JobOfferSentToFreelancer($offer->user->first_name, $offer->contract_title, $offer->freelancer->first_name));
        } catch (\Exception $e) {
        }
        $data1 = 'Received  Offer Accepted Successfully';
        try {
            Notification::send($offer->freelancer, new PublicNotification($data1));
        } catch (\Exception $e) {
        }

        return redirect()->route('freelancer.contract.show', $offer->id)
            ->with('success', ['Offer Accepted successfully', $this->randomKey()]);

    }

    public function decline(string $id)
    {
        // dd($id);
        $offer = $this->offerInterface->findByColumn(['id' => $id]);
        $proposal = $this->proposalInterface->findByColumn(['id' => $offer->proposal_id]);
        $offer->update(['status' => 'rejected']);
        $proposal->update(['proposal_status' => 'canceled']);
        $data = 'Offer';
        $user = Auth::user();
        $data1 = ' Your Send Offer Declined '.$user->first_name;

        try {
            Notification::send($offer->freelancer, new DeleteNotification($data));
        } catch (\Exception $e) {
        }
        try {
            Notification::send($offer->user, new PublicNotification($data1));
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', ['Offer Declined Successfully', $this->randomKey()]);
    }
}
