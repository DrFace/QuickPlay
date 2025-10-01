<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class OfferMilestoneAttachment extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_milestone_id',
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
