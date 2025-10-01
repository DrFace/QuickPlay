<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;

class OfferRecentActivity extends Model
{
    protected $fillable = [
        'offer_id',
        'activity',
    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    protected $appends = [
        'created_at_human',
    ];

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }
}
