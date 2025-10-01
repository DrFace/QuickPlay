<?php

namespace App\Listeners;

use App\Notifications\AppNotification\PublicNotification;
use App\Notifications\ConnectsPurchased\ConnectsPurchased;
use App\Notifications\PaymentReceivedNextMilestone\PaymentReceivedFullProject;
use App\Notifications\PaymentReceivedNextMilestone\PaymentReceivedNextMilestoneNotification;
use App\Notifications\SendAndOffer\JobOfferReceivedFromClient;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\OfferRecentActivity\OfferRecentActivityInterface;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;
use Laravel\Cashier\Events\WebhookReceived as EventsWebhookReceived;

class StripeEventListener
{
    /**
     * Create the event listener.
     */
    public function __construct(
        protected PaymentInterface $paymentInterface,
        protected CreditInterface $creditInterface,
        protected OfferInterface $offerInterface,
        protected ProposalInterface $proposalInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected OfferMilestoneAttachmentInterface $offerMilestoneAttachmentInterface,
        protected OfferRecentActivityInterface $offerRecentActivityInterface,
    ) {}

    /**
     * Handle the event.
     */
    public function handle(EventsWebhookReceived $event): void
    {

        // Log::info('Received webhook:', $event->payload);
        if ($event->payload['type'] === 'charge.succeeded') {
            $payment = $this->paymentInterface->findByColumn([
                'stripe_charge_id' => $event->payload['data']['object']['id'],
                'stripe_customer_id' => $event->payload['data']['object']['customer'],
            ], ['*'], ['user']);

            if ($payment) {
                $payment->update([
                    'status' => 'succeeded',
                    'receipt_url' => $event->payload['data']['object']['receipt_url'],
                ]);

                if ($payment->payment_for === 'connect_package') {
                    $credit = $this->creditInterface->findById($payment->credit_id);
                    if ($credit) {
                        $credit->update([
                            'status' => 'active',
                            'expire_date' => Carbon::now()->addYear(),
                        ]);
                        $credit->save();

                        try {
                            Notification::send($payment->user, new ConnectsPurchased($payment->user->first_name, $payment->amount));
                        } catch (\Exception $e) {
                        }

                    }
                } elseif ($payment->payment_for === 'full_project' || $payment->payment_for === 'milestone') {
                    // Log::info('Payment for full project or milestone:', [$payment]);
                    $offer = $this->offerInterface->findByColumn(['id' => $payment->offer_id]);
                    if ($offer) {

                        $proposal = $this->proposalInterface->findByColumn(['id' => $offer->proposal_id]);
                        // Log::info('Proposal found:', [$proposal]);
                        if ($offer->status === 'draft') {
                            $offer->status = 'pending';
                            $offer->save();
                            $proposal->proposal_status = 'offered';
                            $proposal->save();

                            $data1 = 'Offer Send Successfully';
                            try {
                                Notification::send($offer->freelancer, new JobOfferReceivedFromClient($offer->user->first_name, $offer->contract_title, $offer->freelancer->first_name));
                            } catch (\Exception $e) {
                            }
                            try {
                                Notification::send($offer->user, new PublicNotification($data1));
                            } catch (\Exception $e) {
                            }
                            if ($payment->payment_for === 'full_project') {
                                try {
                                    Notification::send($offer->freelancer, new PaymentReceivedFullProject($offer->user->first_name, $offer->freelancer->first_name, $offer->contract_title));
                                } catch (\Exception $e) {
                                }
                            }

                            $this->offerRecentActivityInterface->create([
                                'offer_id' => $offer->id,
                                'activity' => 'Offer sent to '.$offer->freelancer->first_name.' by '.$offer->user->first_name,
                            ]);

                        }
                        $milestone = $this->offerMilestoneInterface->findByColumn(['id' => $payment->offer_milestone_id]);
                        // Log::info('Milestone found:', [$milestone]);
                        if ($milestone) {
                            // Log::info('Milestone found:', [$milestone]);
                            $milestone->status = 'paid';
                            $milestone->save();
                            $this->offerMilestoneAttachmentInterface->create([
                                'offer_milestone_id' => $milestone->id,
                            ]);
                            try {
                                Notification::send($offer->freelancer, new PaymentReceivedNextMilestoneNotification($offer->user->first_name, $offer->freelancer->first_name, $offer->contract_title
                                ));
                            } catch (\Exception $e) {
                            }

                            $this->offerRecentActivityInterface->create([
                                'offer_id' => $offer->id,
                                'activity' => 'Milestone paid to '.$offer->freelancer->first_name.' by '.$offer->user->first_name,
                            ]);

                        }
                    }
                }
            }
        }
    }
}
