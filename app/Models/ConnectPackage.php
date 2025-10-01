<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ConnectPackage extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'connects',
        'amount',
        'label',
        'status',
    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
    ];

    // connect cast intiger
    protected $casts = [
        'connects' => 'integer',

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
                $query->where('connects', 'like', '%'.$search.'%')
                    ->orWhere('status', 'like', '%'.$search.'%')
                   // ->orWhere('label', 'like', '%'.$search.'%');
                    ->orWhere('amount', 'like', '%'.$search.'%')
                    ->orWhere('created_at', 'like', '%'.$search.'%');
            });
        })->when($filters['trashed'] ?? null, function ($query, $trashed) {
            if ($trashed === 'with') {
                $query->withTrashed();
            } elseif ($trashed === 'only') {
                $query->onlyTrashed();
            }
        })->Where('status', '!=', 'draft');

        $query->when($filters['range1'] ?? null, function ($query, $range1) {
            $query->whereDate('created_at', '>=', $range1);
        });

        $query->when($filters['range2'] ?? null, function ($query, $range2) {
            $query->whereDate('created_at', '<=', $range2);
        });

        return $query;

    }
}
