<?php

namespace App\Notifications\PaymentReceivedNextMilestone;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class PaymentReceivedFullProject extends Notification
{
    use Queueable;

    public $first_name;

    public $freelancer_first_name;

    public $contract_title;

    public function __construct($first_name, $freelancer_first_name, $contract_title)
    {
        $this->first_name = $first_name;
        $this->freelancer_first_name = $freelancer_first_name;
        $this->contract_title = $contract_title;

    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Payment Received for the Project on {$this->contract_title}")
            ->view('mail.payment_received_next_milestone.payment-received-full-project', [
                'freelancer_first_name' => $this->freelancer_first_name,
                'first_name' => $this->first_name,
                'contract_title' => $this->contract_title,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Payment  Received for the Project ',
        ];
    }
}
