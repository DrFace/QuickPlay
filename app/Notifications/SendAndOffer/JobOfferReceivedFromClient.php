<?php

namespace App\Notifications\SendAndOffer;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobOfferReceivedFromClient extends Notification
{
    use Queueable;

    public $freelancer_first_name;

    public $first_name;

    public $contract_title;

    public function __construct($freelancer_first_name, $contract_title, $first_name)
    {
        $this->freelancer_first_name = $freelancer_first_name;
        $this->first_name = $first_name;
        $this->contract_title = $contract_title;
    }

    public function via(): array
    {
        return ['mail', 'database'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject("You’ve Received a Job Offer from {$this->first_name}")
            ->view('mail.send_offer.job-offer-received-from-client', [

                'freelancer_first_name' => $this->freelancer_first_name,
                'contract_title' => $this->contract_title,
                'first_name' => $this->first_name,

            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'You’ve Received a Job Offer from '.$this->first_name,
        ];
    }
}
