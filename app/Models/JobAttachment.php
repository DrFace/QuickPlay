<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class JobAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_post_id',
        'type',
        'size',
        'file_name',
        'path',
        'status',
    ];

    protected $appends = [
        'path_url',
    ];

    public function getPathUrlAttribute()
    {
        return Storage::url($this->path);
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class);
    }
}
