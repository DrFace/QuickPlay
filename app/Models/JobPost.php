<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class JobPost extends Model
{
    use HasFactory, HasUuids;

    public $timestamps = true;

    protected $fillable = [
        'title',
        'category_id',
        'skills',
        'scope_size',
        'scope_duration',
        'scope_experience',
        'budget',
        'description',
        'user_id',
        'status',
        'created_at',
        'updated_at',

    ];

    protected $appends = [
        'created_at_human',
        'updated_at_human',
        'created_at_human_ago',
        'updated_at_human_ago',
        'public_url',
        'proposal_count',
        'chat_count',
        'offer_count',
        'skill_list',
        'job_category',
        'is_favorite',
    ];

    protected $with = ['client'];

    /**
     * Method getProposalCountAttribute
     */
    public function getJobCategoryAttribute(): string
    {

        return $this->jobCategory()->where('id', $this->category_id)->first()->name ?? '';
    }

    public function getIsFavoriteAttribute(): bool
    {
        $user = Auth::user();
        if ($user) {
            $jobPost = $this->find($this->id);

            return $jobPost->favoriteJobs()->where('user_id', $user->id)->exists();
        }

        return false;
    }

    public function getProposalCountAttribute(): int
    {
        return $this->proposals()->count();
    }

    public function getChatCountAttribute(): int
    {
        return $this->chats()->count();
    }

    public function getOfferCountAttribute(): int
    {
        return $this->offers()->where('status', '!=', 'draft')->count();
    }

    // public url for job view
    public function getPublicUrlAttribute(): string
    {
        $appUrl = Config('services.app_url');
        $url = $appUrl.'/jv/'.$this->id;

        return $url;
    }

    /**
     * Method getCreatedAtHumanAttribute
     */
    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function getSkillListAttribute(): array
    {
        $skills = $this->skills;
        $skillList = [];

        if (empty($skills)) {
            return $skillList;
        }

        if (is_string($skills)) {
            $skills = json_decode($skills, true);
        }

        if (! is_array($skills)) {
            return $skillList;
        }

        foreach ($skills as $skillId) {
            $skill = SkillCategory::find($skillId);
            if ($skill) {
                $skillList[] = $skill->name;
            }
        }

        return $skillList;
    }

    /**
     * Method getUpdatedAtHumanAttribute
     */
    public function getUpdatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->updated_at)->format('M d, Y');
    }

    /**
     * Method getCreatedAtHumanAgoAttribute
     */
    public function getCreatedAtHumanAgoAttribute(): string
    {
        // dd(Carbon::parse($this->created_at)->diffForHumans());
        return $this->created_at ? Carbon::parse($this->created_at)->diffForHumans() : 'No creation date available';
    }

    /**
     * Method getUpdatedAtHumanAttribute
     */
    public function getUpdatedAtHumanAgoAttribute(): string
    {
        return Carbon::parse($this->updated_at)->diffForHumans();
    }

    /**
     * Method client
     *
     * @return void
     */
    public function client()
    {
        return $this->belongsTo(User::class, 'user_id')->withTrashed();
    }

    /**
     * Method JobAttachment
     *
     * @return void
     */
    public function attachments()
    {
        return $this->hasMany(JobAttachment::class);
    }

    public function jobCategory()
    {
        return $this->belongsTo(JobCategory::class, 'category_id');
    }

    public function proposals()
    {
        return $this->hasMany(Proposal::class, 'job_post_id');
    }

    public function chats()
    {
        return $this->hasMany(Chat::class);
    }

    public function offers()
    {
        return $this->hasMany(Offer::class);
    }

    public function favoriteJobs()
    {
        return $this->hasMany(FavoriteJobs::class, 'job_id');
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
                $query->where('title', 'like', '%'.$search.'%')
                    ->orWhere('status', 'like', '%'.$search.'%');
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
