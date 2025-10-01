<?php

namespace App\Notifications\ConnectsPurchased;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ConnectsPurchased extends Notification
{
    use Queueable;

    public $first_name;

    public $amount;

    public function __construct($first_name, $amount)
    {
        $this->first_name = $first_name;
        $this->amount = $amount;
    }

    public function via(): array
    {
        return ['mail', 'database'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Connects Purchased Successfully')
            ->view('mail.connect_purchased.connects-purchased', [
                'amount' => $this->amount,
                'freelancer_first_name' => $this->first_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Connects Purchased Successfully', ];
    }
}
