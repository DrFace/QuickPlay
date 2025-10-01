<?php

namespace App\Notifications\PaymentApprovedNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentApprovedNotification extends Notification
{
    use Queueable;

    public $freelancer_name;

    public function __construct($freelancer_name)
    {
        $this->freelancer_name = $freelancer_name;
    }

    public function via($notifiable): array
    {
        return ['mail'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your Payment Request Has Been Approved')
            ->view('mail.payment_approved.payment-approved', [
                'freelancer_name' => $this->freelancer_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Your Payment Request Has Been Approved.',
        ];
    }
}
