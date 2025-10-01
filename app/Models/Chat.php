<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Chat extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'proposal_id',
        'client_id',
        'freelancer_id',
    ];

    /**
     * The attributes that should be appended for serialization.
     */
    protected $appends = [
        'created_at_human',
        'last_message',
    ];

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposal_id');
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id')->withTrashed()->select('id', 'first_name', 'last_name', 'image', 'time_zone', 'active_status');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id')->withTrashed()->select('id', 'first_name', 'last_name', 'image', 'time_zone', 'active_status');
    }

    public function getCreatedAtHumanAttribute(): string
    {
        // format = 6/13/24
        return Carbon::parse($this->created_at)->format('m/d/y');
    }

    public function messages()
    {
        return $this->hasMany(Message::class, 'chat_id');
    }

    // last message

    public function getLastMessageAttribute()
    {
        return $this->messages()->latest()->first();
    }

    /**
     * @param  mixed  $query
     * @param  mixed  $column
     * @param  string  $direction
     * @return [type]
     */
    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        $query->orderBy($column, $direction);
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                // Searching by the Chat's ID
                $query->where('id', 'like', '%'.$search.'%')
                    // Join the users table for the client
                    ->orWhereHas('client', function ($q) use ($search) {
                        $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                    })
                    // Join the users table for the freelancer
                    ->orWhereHas('freelancer', function ($q) use ($search) {
                        $q->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                    });
            });
        })
            ->when($filters['trashed'] ?? null, function ($query, $trashed) {
                if ($trashed === 'with') {
                    $query->withTrashed();
                } elseif ($trashed === 'only') {
                    $query->onlyTrashed();
                }
            });
    }
}
