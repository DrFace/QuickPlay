<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendPasswordChangeConfirmation extends Notification
{
    use Queueable;

    public $otp;

    public $email;

    public function __construct($otp, $email)
    {
        $this->otp = $otp;
        $this->email = $email;
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {

        return (new MailMessage)
            ->subject('OTP Verification for Password Change')
            ->view('emails.password_change_otp', [
                'otp' => $this->otp,
                'email' => $this->email,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}
