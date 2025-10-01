<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Review\ReviewRequest;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\Review\ReviewInterface;
use App\Repositories\All\User\UserInterface;
use App\Services\ReviewService\ReviewService;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FreelancerReviewController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected OfferInterface $offerInterface,
        protected ReviewInterface $reviewInterface,
        protected ProposalInterface $proposalInterface,
        protected ReviewService $reviewService,
        protected OfferRecentActivityInterface $offerRecentActivityInterface,
    ) {}

    public function review(string $id)
    {
        $offer = $this->offerInterface->findByUuId($id, ['*'], ['freelancer', 'user']);

        return Inertia::render('Client/Review/Index', [
            'offer' => $offer,
            'user' => Auth::user(),
        ]);
    }

    public function submitReview(ReviewRequest $request, string $id)
    {
        // dd($request->all());
        $data = $request->all();
        $data['status'] = 'submitted';
        $review = $this->reviewInterface->findByColumn(['offer_id' => $id, 'user_id' => Auth::id()]);
        if ($review) {
            $this->reviewInterface->update($review->id, $data);
        } else {
            $this->reviewInterface->create(array_merge($data, ['offer_id' => $id, 'user_id' => Auth::id()]));
        }

        $offer = $this->offerInterface->findByUuId($id);
        $review = $this->reviewInterface->findByColumn(['offer_id' => $offer->id, 'user_id' => $offer->freelancer_id]);

        if ($review && $review->status === 'submitted') {

            $user = Auth::user();
            $this->reviewService->ratingUpdate($user->id, $request->avg_score_rate);
            $this->reviewService->ratingUpdate($offer->freelancer_id, $review->avg_score_rate);

            $proposal = $this->proposalInterface->findByColumn(['id' => $offer->proposal_id]);
            $offer->status = 'completed';
            $offer->save();
            $proposal->proposal_status = 'completed';
            $proposal->save();
        }

        $this->offerRecentActivityInterface->create([
            'offer_id' => $offer->id,
            'activity' => 'Review submitted by client',
        ]);

        return redirect()->route('client.contracts.show', $id)->with('success', 'Review Submitted Successfully');
    }
}
