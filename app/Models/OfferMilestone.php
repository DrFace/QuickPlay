<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OfferMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'description',
        'due_date',
        'amount',
        'status',
        'created_at',
        'updated_at',

    ];

    protected $appends = [
        'due_date_human',
    ];

    public function attachments()
    {
        return $this->hasMany(OfferMilestoneAttachment::class, 'offer_milestone_id');
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'offer_id');
    }

    public function getDueDateHumanAttribute($value)
    {
        return Carbon::parse($this->due_date)->format('M d, Y');
    }

    protected static function boot()
    {
        parent::boot();

        // Set a global scope to order by created_at ascending by default
        static::addGlobalScope('orderByCreatedAt', function ($query) {
            $query->orderBy('due_date', 'asc');
        });
    }
}
