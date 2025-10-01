<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'user_id',
        'job_post_id',
        'proposal_id',
        'offer_price',
        'payment_type',
        'contract_title',
        'contract_description',
        'status',
        'due_date',
        'freelancer_id',
    ];

    protected $appends = [
        'due_date_formatted',
        'milestones_formatted',
        'active_milestone',
        'complete_milestone_amount',
        'created_at_human',
    ];

    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function jobPost()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    public function proposal()
    {
        return $this->belongsTo(Proposal::class, 'proposal_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id')->withTrashed();
    }

    public function getDueDateFormattedAttribute()
    {
        return $this->due_date ? Carbon::parse($this->due_date)->format('M d, Y') : null;
    }

    public function attachments()
    {
        return $this->hasMany(OfferAttachment::class, 'offer_id');
    }

    public function milestones()
    {
        return $this->hasMany(OfferMilestone::class, 'offer_id');
    }

    public function getMilestonesFormattedAttribute()
    {
        $milestones = $this->milestones;
        if ($milestones->isEmpty()) {
            $milestone[0] = [
                'dueDate' => Carbon::now()->format('Y-m-d'),
                'description' => null,
                'amount' => null,
            ];

            return $milestone;
        }

        return $this->milestones->map(function ($milestone) {
            return [
                'dueDate' => Carbon::parse($milestone->due_date)->format('Y-m-d'),
                'description' => $milestone->description,
                'amount' => $milestone->amount,
            ];
        });
    }

    public function getActiveMilestoneAttribute()
    {
        //  return Milestone 1 or Milestone 2 or Milestone 3;

        $milestones = $this->milestones;
        $i = 1;
        $data = [
            'id' => null,
            'name' => 'Payment Completed',
            'dueDate' => Carbon::now()->format('M d, Y'),
            'status' => false,
        ];

        // Loop through each milestone to find the active one
        foreach ($milestones as $milestone) {
            // Check if we are at a valid index before accessing previous milestones
            if ($milestone->status == 'active') {
                // Check if the previous milestones exist before using them
                $previousMilestone1 = isset($milestones[$i - 1]) ? $milestones[$i - 1] : null;
                $previousMilestone2 = isset($milestones[$i - 2]) ? $milestones[$i - 2] : null;

                // Determine if the milestone is marked as active or completed
                $data['status'] = ($previousMilestone1 && $previousMilestone1->status == 'active' &&
                                   $previousMilestone2 && $previousMilestone2->status == 'completed') ? true : false;

                $data['id'] = $milestone->amount;
                $data['name'] = 'Milestone '.$i;
                $data['dueDate'] = Carbon::parse($milestone->due_date)->format('M d, Y');
                break;
            }
            $i++;
        }

        return $data;
    }

    public function getCompleteMilestoneAmountAttribute()
    {
        $milestones = $this->milestones;
        // dd($milestones);
        $amount = 0;
        foreach ($milestones as $milestone) {
            if ($milestone->status == 'completed' || $milestone->status == 'paid') {
                $amount += $milestone->amount;
            }
        }

        return $amount;
    }

    /**
     * @param  mixed  $query
     * @param  mixed  $column
     * @param  string  $direction
     * @return [type]
     */
    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        $query->orderBy($column, $direction);
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->Where('status', 'like', '%'.$search.'%');
            });
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        });

        $query->when($filters['range1'] ?? null, function ($query, $range1) {
            $query->whereDate('created_at', '>=', $range1);
        });

        $query->when($filters['range2'] ?? null, function ($query, $range2) {
            $query->whereDate('created_at', '<=', $range2);
        });

        return $query;
    }
}
