<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected CreditInterface $creditInterface,
        protected OfferInterface $offerInterface,
        protected ProposalInterface $proposalInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected OfferMilestoneAttachmentInterface $offerMilestoneAttachmentInterface,
        protected PaymentInterface $paymentInterface,
    ) {}

    public function createPaymentIntent(string $id)
    {
        // dd($id);

        $offer = $this->offerInterface->findByColumn(['id' => $id]);
        if ($offer->payment_type === 'Milestone') {
            $lastMilestone = $this->offerMilestoneInterface->findByColumn(['offer_id' => $id, 'status' => 'active']);
            $price = $lastMilestone->amount;
        } else {
            $price = $offer->offer_price;
        }

        $intent = auth()->user()->createSetupIntent();

        return Inertia::render('Client/Job/Hire/Payment/Index', [
            'clientSecret' => $intent->client_secret,
            'price' => $price,
            'connectPackageId' => $id,
            'user' => $this->userInterface->getByColumn(['id' => Auth::id()]),
        ]);
    }

    public function processPayment(Request $request)
    {
        // dd($request->all());
        try {
            $paymentMethod = $request->payment_method;
            $price = $request->price;
            $user = auth()->user();
            $user->createOrGetStripeCustomer();
            $user->addPaymentMethod($paymentMethod);

            $paymentIntent = $user->charge(
                $price * 100,
                $paymentMethod,
                [
                    'return_url' => route('client.job.all'),
                ]
            );
            $offer = $this->offerInterface->findByColumn(['id' => $request->offerId]);
            if ($paymentIntent->status == 'succeeded') {

                $milestone = $this->offerMilestoneInterface->findByColumn(['offer_id' => $request->offerId, 'status' => 'active']);
                $payment = $this->paymentInterface->create([
                    'user_id' => $user->id,
                    'type' => 'credit',
                    'amount' => $price,
                    'currency' => 'usd',
                    'status' => 'pending',
                    'payment_for' => $offer->payment_type === 'Milestone' ? 'milestone' : 'full_project',
                    'offer_id' => $offer->id,
                    'freelancer_id' => $offer->freelancer_id,
                    'offer_milestone_id' => $milestone ? $milestone->id : null,
                    'stripe_customer_id' => $paymentIntent->customer,
                    'stripe_charge_id' => $paymentIntent->latest_charge,
                    'stripe_payment_method_id' => $paymentIntent->payment_method,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'description' => $offer->payment_type === 'Milestone' ? 'Milestone payment' : 'Full project payment',
                ]);

                return redirect()->route('client.contracts.show', $offer->id)
                    ->with('success', ['Payment Successful', $this->randomKey()]);
            } else {
                return redirect()->route('client.contracts.show', $offer->id)
                    ->with('error', ['Payment failed,Try again', $this->randomKey()]);
            }
        } catch (\Exception $exception) {
            return redirect()->route('client.contracts.show', $offer->id)
                ->with('error', ['Payment failed,Try again', $this->randomKey()]);
        }
    }

    public function getClientSecret(Request $request)
    {
        $intent = auth()->user()->createSetupIntent();

        return response()->json(['client_secret' => $intent->client_secret]);
    }
}
