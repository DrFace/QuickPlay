<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'user_id',
        'reviewer_id',
        'recommend_rate',
        'feedback',
        'contract_end_reason',
        'english_proficiency',
        'skills_rate',
        'quality_rate',
        'availability_rate',
        'adherence_rate',
        'communication_rate',
        'cooperation_rate',
        'avg_score_rate',
        'your_experience',
        'status',
    ];

    /**
     * The attributes that should be appended for serialization.
     */
    protected $with = [
        'offer',

    ];

    public function offer()
    {
        return $this->belongsTo(Offer::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id')->withTrashed();
    }
}
