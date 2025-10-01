<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Kodeine\Metable\Metable;

class Payment extends Model
{
    use HasFactory, HasUuids, Metable;

    protected $metaTable = 'payments_meta';

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'currency',
        'status',
        'admin_status',
        'payment_status',
        'payment_for',
        'offer_id',
        'freelancer_id',
        'offer_milestone_id',
        'credit_id',
        'balance_request_id',
        'stripe_customer_id',
        'stripe_charge_id',
        'stripe_payment_method_id',
        'stripe_payment_intent_id',
        'description',
        'receipt_url',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
        'full_name',
        'received_amount',
        'payment_release_status',
    ];

    protected $casts = [
        'amount' => 'float',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    public function offer()
    {
        return $this->belongsTo(Offer::class, 'offer_id');
    }

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function getReceivedAmountAttribute(): float
    {
        return $this->amount - ($this->amount * 0.10);
    }

    public function getFullNameAttribute(): string
    {
        $user = $this->user;
        if ($user) {
            return $user->full_name;
        }

        return '';
    }

    /**
     * Method getPaymentReleaseStatusAttribute
     */
    public function getPaymentReleaseStatusAttribute(): string
    {
        if ($this->admin_status === 'approved') {
            return 'Released';
        } else {
            if ($this->payment_for === 'milestone') {
                foreach ($this->offer->milestones as $milestone) {
                    if ($milestone->id === $this->offer_milestone_id) {
                        if ($milestone->status === 'completed') {
                            return 'Can be released';
                        } else {
                            return 'Pending';
                        }
                    }
                }
            } elseif ($this->payment_for === 'full_project') {
                if ($this->offer->status === 'completed') {
                    return 'Can be released';
                } else {
                    return 'Pending';
                }
            } else {
                return 'N/A';
            }
        }
    }

    /**
     * Method getUpdatedAtHumanAttribute
     */
    public function getUpdatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->updated_at)->format('M d, Y');
    }

    /**
     * @param  mixed  $query
     * @param  mixed  $column
     * @param  string  $direction
     * @return void
     */
    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        if ($column === 'full_name') {
            $query->join('users', 'payments.user_id', '=', 'users.id')
                ->orderByRaw("CONCAT(users.first_name, ' ', users.last_name) $direction");
        } else {
            $query->orderBy($column, $direction);
        }
    }

    /**
     * @param  mixed  $query
     * @return void
     */
    public function scopeFilter($query, array $filters)
    {
        // dd($filters);
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('id', 'like', '%'.$search.'%')
                    ->orWhere('status', 'like', '%'.$search.'%')
                    ->orWhere('type', 'like', '%'.$search.'%')
                    ->orWhere('amount', 'like', '%'.$search.'%')
                    ->orWhere('currency', 'like', '%'.$search.'%')
                    ->orWhere('payment_for', 'like', '%'.$search.'%')
                    ->orWhereHas('user', function ($query) use ($search) {
                        $query->whereRaw("CONCAT(first_name, ' ', last_name) LIKE ?", ['%'.$search.'%']);
                    });
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

        $query->when($filters['status'] ?? null, function ($query, $status) {

            // dd($status);
            if ($status === 'Released') {
                $query->where('admin_status', 'approved');
            } elseif ($status === 'Pending') {
                $query->where(function ($query) {
                    $query->where('payment_for', 'milestone')
                        ->whereHas('offer.milestones', function ($query) {
                            $query->where('status', '!=', 'completed');
                        })
                        ->orWhere(function ($query) {
                            $query->where('payment_for', 'full_project')
                                ->whereHas('offer', function ($query) {
                                    $query->where('status', '!=', 'completed');
                                });
                        });
                });
            } elseif ($status === 'Can be released') {
                $query->where(function ($query) {
                    $query->where('payment_for', 'milestone')
                        ->whereHas('offer.milestones', function ($query) {
                            $query->where('status', 'completed');
                        })
                        ->orWhere(function ($query) {
                            $query->where('payment_for', 'full_project')
                                ->whereHas('offer', function ($query) {
                                    $query->where('status', 'completed');
                                });
                        });
                });
            } else {
                $query->where('status', $status);
            }
        });

        return $query;
    }
}
