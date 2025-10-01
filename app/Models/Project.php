<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'client_id',
        'freelancer_id',
        'status',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
    ];

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    /**
     * Method getUpdatedAtHumanAttribute
     */
    public function getUpdatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->updated_at)->format('M d, Y');
    }

    /**
     * Method ProposalAttachment
     *
     * @return void
     */
    public function attachments()
    {
        return $this->hasMany(ProjectAttachment::class, 'project_id');
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id')->withTrashed();
    }

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id')->withTrashed();
    }
}
