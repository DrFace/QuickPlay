<?php

namespace App\Notifications\AppNotification;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;

class PublicNotification extends Notification
{
    use Queueable;

    public $data1;

    public function __construct($data1)
    {
        $this->data1 = $data1;
    }

    public function via(): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        return [
            'message' => $this->data1,
        ];
    }
}
