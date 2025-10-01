<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendEmailChangeConfirmation extends Notification
{
    use Queueable;

    public $email;

    public function __construct($email)
    {
        $this->email = $email;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {

        return (new MailMessage)
            ->subject('Email Change Successful')
            ->view('emails.email_change_confirmation', [
                'email' => $this->email,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Email Change Successfully Completed',
        ];
    }
}
