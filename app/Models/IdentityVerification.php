<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class IdentityVerification extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'selfie_image',
        'id_card_image',
        'status',
        'reject_reason',

    ];

    protected $appends = [
        'created_at_human',
        'selfie_image_url',
        'id_card_image_url',
        'full_name',
    ];

    public function getFullNameAttribute(): string
    {
        return $this->user->full_name;
    }

    /**
     * getImageUrlAttribute
     */
    public function getSelfieImageUrlAttribute(): string
    {
        return Storage::url($this->selfie_image);
    }

    /**
     * getImageUrlAttribute
     */
    public function getIdCardImageUrlAttribute(): string
    {
        return Storage::url($this->id_card_image);
    }

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
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
            $query->join('users', 'identity_verifications.user_id', '=', 'users.id')
                ->orderByRaw("CONCAT(users.first_name, ' ', users.last_name) $direction");
        } else {
            $query->orderBy($column, $direction);
        }
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('created_at', 'like', '%'.$search.'%')
                    ->orWhere('status', 'like', '%'.$search.'%')
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
        })->where('status', '!=', 'step_one_done')
            ->where('status', '!=', 'start');

        $query->when($filters['range1'] ?? null, function ($query, $range1) {
            $query->whereDate('created_at', '>=', $range1);
        });

        $query->when($filters['range2'] ?? null, function ($query, $range2) {
            $query->whereDate('created_at', '<=', $range2);
        });

        return $query;
    }
}
