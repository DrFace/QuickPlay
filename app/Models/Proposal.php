<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Proposal extends Model
{
    use HasFactory ,HasUuids;

    protected $fillable = [
        'job_post_id',
        'user_id',
        'paid_type',
        'bid_amount',
        'service_fee',
        'receive_amount',
        'duration',
        'description',
        'status',
        'proposal_status',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
        'created_at_human_ago',
        'has_active_offer',
        'milestones_formatted',
        'offer_id',
    ];

    protected $with = ['freelancer'];

    /**
     * Method hasActiveOfferAttribute
     */
    public function getHasActiveOfferAttribute(): bool
    {
        return $this->offers()->where('status', '!=', 'draft')->exists();
    }

    /**
     * Method offers
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function offers()
    {
        return $this->hasMany(Offer::class, 'proposal_id');
    }

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
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAgoAttribute(): string
    {
        return Carbon::parse($this->created_at)->diffForHumans();
    }

    public function getOfferIdAttribute()
    {
        return $this->offers()->where('proposal_id', $this->id)->first()->id ?? null;
    }

    /**
     * Method job
     *
     * @return void
     */
    public function job()
    {
        return $this->belongsTo(JobPost::class, 'job_post_id');
    }

    public function offer()
    {
        return $this->hasOne(Offer::class);
    }

    /**
     * Method freelancer
     *
     * @return void
     */
    public function freelancer()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    /**
     * Method ProposalAttachment
     *
     * @return void
     */
    public function attachments()
    {
        return $this->hasMany(ProposalAttachment::class);
    }

    /**
     * Method ProposalMilestone
     *
     * @return void
     */
    public function milestones()
    {
        return $this->hasMany(ProposalMilestone::class, 'proposal_id');
    }

    public function getMilestonesFormattedAttribute()
    {
        $milestones = $this->milestones;
        if ($milestones->isEmpty()) {
            $milestone[0] = [
                'dueDate' => null,
                'description' => null,
                'amount' => null,
            ];

            return $milestone;
        }

        return $milestones->map(function ($milestone) {
            return [
                'dueDate' => Carbon::parse($milestone->due_date)->format('Y-m-d'),
                'description' => $milestone->description,
                'amount' => $milestone->amount,
            ];
        });
    }

    /**
     * @param  mixed  $query
     * @param  mixed  $column
     * @param  string  $direction
     * @return [type]
     */
    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        if ($column == 'name') {
            // Assuming you want to sort by the freelancer's name
            return $query->join('users', 'proposals.user_id', '=', 'users.id')
                ->orderBy('users.first_name', $direction)
                ->select('proposals.*');
        }

        // Default sorting by column
        return $query->orderBy($column, $direction);
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('bid_amount', 'like', '%'.$search.'%')
                    ->orWhereHas('freelancer', function ($query) use ($search) {
                        $query->where('first_name', 'like', '%'.$search.'%')
                            ->orWhere('last_name', 'like', '%'.$search.'%')
                            ->orWhereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ["%{$search}%"]);
                    });
            });
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        })->where('status', '!=', 'draft');

        $query->when($filters['range1'] ?? null, function ($query, $range1) {
            $query->whereDate('created_at', '>=', $range1);
        });

        $query->when($filters['range2'] ?? null, function ($query, $range2) {
            $query->whereDate('created_at', '<=', $range2);
        });

        return $query;
    }
}
