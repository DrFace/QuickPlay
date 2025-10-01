<?php

namespace App\Notifications\AppNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class DeleteNotification extends Notification
{
    use Queueable;

    public $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    public function via(): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => $this->data.' Delete Successfully Completed ',
        ];
    }
}
