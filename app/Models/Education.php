<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Education extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'school',
        'start_date',
        'end_date',
        'degree',
        'area_of_study',
        'description',
    ];

    /**
     * The attributes that should be appended for serialization.
     */
    protected $appends = [
        'start_date_human',
        'end_date_human',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function getStartDateHumanAttribute(): string
    {
        return Carbon::parse($this->start_date)->format('M Y');
    }

    public function getEndDateHumanAttribute(): string
    {
        return Carbon::parse($this->end_date)->format('M Y');
    }
}
