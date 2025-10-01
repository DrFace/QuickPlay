<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FavoriteJobs extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_id',
    ];

    /**
     * Get the freelancer that owns the favorite job.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id')->withTrashed();
    }

    /**
     * Get the job post that this favorite job is associated with.
     */
    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_id', 'id');
    }
}
