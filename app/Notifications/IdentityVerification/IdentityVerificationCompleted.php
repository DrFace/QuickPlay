<?php

namespace App\Notifications\IdentityVerification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IdentityVerificationCompleted extends Notification
{
    use Queueable;

    public $first_name;

    public function __construct($first_name)
    {
        $this->first_name = $first_name;
    }

    public function via(): array
    {
        return ['mail', 'database'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Identity Verification Completed ')
            ->view('mail.identity_verification.identity-verification-completed', [
                'first_name' => $this->first_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return ['message' => 'Identity Verification Successfully Completed '];
    }
}
