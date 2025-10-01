<?php

namespace App\Notifications\TicketReplyNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class AdminTicketReplyNotification extends Notification
{
    use Queueable;

    public $user;

    public $ticket_subject;

    public function __construct($user, $ticket_subject)
    {
        $this->user = $user;
        $this->ticket_subject = $ticket_subject;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Admin Reply to Your Support Ticket')
            ->view('mail.ticket_reply.ticket-reply', [
                'user' => $this->user,
                'ticket_subject' => $this->ticket_subject,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Admin Reply to Your Support Ticket',
        ];
    }
}
