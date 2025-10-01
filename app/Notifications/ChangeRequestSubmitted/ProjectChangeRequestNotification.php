<?php

namespace App\Notifications\ChangeRequestSubmitted;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectChangeRequestNotification extends Notification
{
    use Queueable;

    public $first_name;

    public $contract_title;

    public $freelancer_first_name;

    public function __construct($first_name, $contract_title, $freelancer_first_name)
    {
        $this->first_name = $first_name;
        $this->freelancer_first_name = $freelancer_first_name;
        $this->contract_title = $contract_title;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Change Request Submitted for  {$this->contract_title}")
            ->view('mail.change_request_submitted.project-change-request', [

                'first_name' => $this->first_name,
                'contract_title' => $this->contract_title,
                'freelancer_first_name' => $this->freelancer_first_name,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => 'Change Request Received for '.$this->contract_title,
        ];
    }
}
