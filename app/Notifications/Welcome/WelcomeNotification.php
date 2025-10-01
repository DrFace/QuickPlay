<?php

namespace App\Notifications\Welcome;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotification extends Notification
{
    use Queueable;

    public $first_name;

    public function __construct(string $first_name)
    {

        $this->first_name = $first_name;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {

        return (new MailMessage)
            ->subject('Welcome to AI Geeks!')
            ->markdown('mail.welcome.welcome-notification', [
                'first_name' => $this->first_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Welcome to Ai-Geeks '.$this->first_name,
        ];
    }
}
