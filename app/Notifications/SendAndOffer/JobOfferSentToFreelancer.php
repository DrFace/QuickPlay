<?php

namespace App\Notifications\SendAndOffer;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class JobOfferSentToFreelancer extends Notification
{
    use Queueable;

    public $first_name;

    public $freelancer_first_name;

    public $contract_title;

    public function __construct($first_name, $contract_title, $freelancer_first_name)
    {
        $this->first_name = $first_name;
        $this->freelancer_first_name = $freelancer_first_name;
        $this->contract_title = $contract_title;

    }

    public function via(): array
    {
        return ['mail', 'database'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject("You've Sent a Job Offer Accepted to {$this->first_name}")
            ->view('mail.send_offer.job-offer-sent-to-freelancer', [

                'first_name' => $this->first_name,
                'contract_title' => $this->contract_title,
                'freelancer_first_name' => $this->freelancer_first_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Your Job Offer has been Successfully Accepted by  '.$this->freelancer_first_name,
        ];
    }
}
