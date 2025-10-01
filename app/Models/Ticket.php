<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'tickets';

    protected $fillable = [
        'subject',
        'category',
        'description',
        'user_id',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }

    public function replies()
    {
        return $this->hasMany(TicketReply::class);
    }

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

    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        $query->orderBy($column, $direction);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where('subject', 'like', '%'.$search.'%');
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        })->where('status', '!=', 'active');
    }

    public function searchTickets(array $filters = [])
    {
        return Ticket::query()
            ->when(! empty($filters['searchParam']), function ($query) use ($filters) {
                $query->where('subject', 'like', '%'.$filters['searchParam'].'%')
                    ->orWhere('category', 'like', '%'.$filters['searchParam'].'%');
            })
            ->when(! empty($filters['trashed']), function ($query) use ($filters) {
                if ($filters['trashed'] === 'with') {
                    $query->withTrashed();
                } elseif ($filters['trashed'] === 'only') {
                    $query->onlyTrashed();
                }
            })
            ->orderBy($filters['sortBy'], $filters['sortDirection'])
            ->get();

        $query->when($filters['range1'] ?? null, function ($query, $range1) {
            $query->whereDate('created_at', '>=', $range1);
        });

        $query->when($filters['range2'] ?? null, function ($query, $range2) {
            $query->whereDate('created_at', '<=', $range2);
        });
    }

    public function rcreator()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }
}
