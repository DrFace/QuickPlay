<?php

namespace App\Notifications\Welcome;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class WelcomeNotificationWithPassword extends Notification
{
    use Queueable;

    public $temporaryPassword;

    public $first_name;

    public function __construct(string $temporaryPassword, string $first_name)
    {
        $this->temporaryPassword = $temporaryPassword;
        $this->first_name = $first_name;
    }

    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Welcome to AI Geeks')
            ->view('mail.welcome.welcome-temporary-password-notification', [
                'temporaryPassword' => $this->temporaryPassword,
                'first_name' => $this->first_name,
            ]);
    }

    public function toArray(object $notifiable): array
    {
        return [
            'message' => 'Welcome to Ai-Geeks '.$this->first_name,
        ];
    }
}
