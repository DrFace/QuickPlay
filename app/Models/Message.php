<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class Message extends Model
{
    use HasFactory;

    protected $fillable =
        [
            'chat_id',
            'message',
            'sender_id',
            'receiver_id',
            'is_read',
            'read_at',
        ];

    /**
     * The attributes that should be appended for serialization.
     */
    protected $appends = [
        'created_at_human',
    ];

    protected $with = ['attachments'];

    public function attachments()
    {
        return $this->hasMany(MessageAttachment::class);

    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id')->withTrashed()->select('id', 'first_name', 'last_name', 'image', 'time_zone', 'active_status');
    }

    public function receiver()
    {
        return $this->belongsTo(User::class, 'receiver_id')->withTrashed()->select('id', 'first_name', 'last_name', 'image', 'time_zone', 'active_status');
    }

    public function getCreatedAtHumanAttribute(): string
    {
        // Get the current user's ID
        $currentUserId = optional(Auth::user())->id;

        // Check if sender or receiver exists
        $senderTimeZone = $this->sender ? $this->sender->time_zone : 'UTC'; // Default to UTC if sender is null
        $receiverTimeZone = $this->receiver ? $this->receiver->time_zone : 'UTC'; // Default to UTC if receiver is null

        // Use the appropriate timezone based on who sent the message
        if ($currentUserId == $this->sender_id) {
            return Carbon::parse($this->created_at)->timezone($senderTimeZone)->format('M d, Y h:i A');
        } else {
            return Carbon::parse($this->created_at)->timezone($receiverTimeZone)->format('M d, Y h:i A');
        }
    }
}
