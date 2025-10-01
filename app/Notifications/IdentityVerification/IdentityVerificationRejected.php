<?php

namespace App\Notifications\IdentityVerification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class IdentityVerificationRejected extends Notification
{
    use Queueable;

    public $first_name;

    public $reason;

    public function __construct($first_name, $reason)
    {
        $this->first_name = $first_name;
        $this->reason = $reason;
    }

    public function via(): array
    {
        return ['mail', 'database'];
    }

    public function toMail(): MailMessage
    {
        return (new MailMessage)
            ->subject('Identity Verification Rejected ')
            ->view('mail.identity_verification.identity-verification-reject', [
                'first_name' => $this->first_name,
                'reason' => $this->reason,
            ]);
    }

    public function toArray($notifiable): array
    {
        return ['message' => 'Your submission has been rejected. Reason: '.$this->reason.'Please resubmit your ID verification. '];
    }
}
