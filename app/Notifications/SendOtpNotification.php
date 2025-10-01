<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Log;

class SendOtpNotification extends Notification
{
    use Queueable;

    public $otp;

    public $email;

    /**
     * Create a new notification instance.
     */
    public function __construct($otp, $email)
    {
        $this->otp = $otp;
        $this->email = $email;

    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable): MailMessage
    {

        // Log::info('Preparing to send OTP email to: '.$notifiable->routeNotificationFor('mail'));

        return (new MailMessage)
            ->subject('OTP Verification for Email Change')
            ->view('emails.send_otp', [
                'otp' => $this->otp,
                'email' => $this->email,
            ]);

    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable): array
    {
        return [
            // 'otp' => $this->otp,
        ];
    }
}
