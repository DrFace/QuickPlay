<?php

namespace App\Notifications\PaymentApprovedNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PayoutApprovedNotification extends Notification
{
    use Queueable;

    public $freelancerName;

    public function __construct($freelancerName)
    {
        $this->freelancerName = $freelancerName;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Payout Request Has Been Approved')
            ->view('mail.payment_approved.payout-approved', [
                'freelancerName' => $this->freelancerName,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Your Payout Request Has Been Approved.',
        ];
    }
}
