<?php

namespace App\Notifications\ProjectMarkedCompletedNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ProjectMarkedCompletedMilestoneNotification extends Notification
{
    use Queueable;

    public $freelancer_first_name;

    public $first_name;

    public $contract_title;

    public function __construct($freelancer_first_name, $first_name, $contract_title)
    {
        $this->freelancer_first_name = $freelancer_first_name;
        $this->first_name = $first_name;
        $this->contract_title = $contract_title;
    }

    public function via($notifiable): array
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject("Milestone Project {$this->contract_title} Marked as Completed")
            ->view('mail.project_marked_completed.project-marked-completed', [
                'freelancer_first_name' => $this->freelancer_first_name,
                'first_name' => $this->first_name,
                'contract_title' => $this->contract_title,
            ]);
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => "Milestone Project {$this->contract_title} Marked as Completed",
        ];
    }
}
