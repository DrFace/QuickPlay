<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UsersJobCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'job_category_id',
        'skills',
    ];

    protected $appends = [
        'category_name',
        'skills',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function jobCategory()
    {
        return $this->belongsTo(JobCategory::class);
    }

    public function getCategoryNameAttribute()
    {
        return $this->jobCategory->name;
    }

    public function getSkillsAttribute()
    {
        return json_decode($this->attributes['skills']);
    }
}
