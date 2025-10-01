<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class SendTwoFactorConfirmation extends Notification
{
    use Queueable;

    public $otp;

    public $first_name;

    public function __construct($otp, $first_name)
    {
        $this->otp = $otp;
        $this->first_name = $first_name;
    }

    public function via(): array
    {
        return ['mail'];
    }

    public function toMail(): MailMessage
    {

        // return (new MailMessage)
        //     ->subject('TwoFactor Successful')
        //     ->view('emails.two_factor_otp', [
        //         'otp' => $this->otp,
        //         'email' => $this->email,
        //     ]);

        return (new MailMessage)->markdown('mail.two_factor.two-factor-otp', [
            'otp' => $this->otp,
            'first_name' => $this->first_name,
        ]);
    }

    public function toArray($notifiable): array
    {
        return [];
    }
}
