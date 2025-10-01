<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProposalMilestone extends Model
{
    use HasFactory;

    protected $fillable = [
        'proposal_id',
        'description',
        'due_date',
        'amount',
        'status',
    ];

    protected $appends = [
        'due_date_human',
    ];

    public function getDueDateHumanAttribute($value)
    {
        return Carbon::parse($this->due_date)->format('M d, Y');
    }
}
