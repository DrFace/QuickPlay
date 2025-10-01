<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TicketReply extends Model
{
    protected $fillable = ['ticket_id', 'user_id', 'reply'];

    public function ticket()
    {
        return $this->belongsTo(Ticket::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }

    public function rcreator()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }
}
