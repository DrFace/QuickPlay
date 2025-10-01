<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Credit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'connects',
        'available_connects',
        'amount',
        'tax',
        'expire_date',
        'status',
    ];

    protected $appends = [
        'created_at_human',
        'expires_at_human',
    ];

    protected $casts = [
        'connects' => 'integer',
        'available_connects' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function getExpiresAtHumanAttribute(): string
    {
        return Carbon::parse($this->expire_date)->format('M d, Y');
    }
}
