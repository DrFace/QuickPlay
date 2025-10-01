<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Portfolio extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'role',
        'skills',
        'description',
        'image',
        'status',
    ];

    protected $appends = [
        'created_at_human',
        'image_url',
    ];

    /**
     * getImageUrlAttribute
     */
    public function getImageUrlAttribute(): string
    {
        return Storage::url($this->image);
    }

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
}
