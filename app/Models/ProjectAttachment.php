<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProjectAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
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
}
