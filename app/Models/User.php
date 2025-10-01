<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Kodeine\Metable\Metable;
use Laravel\Cashier\Billable;
use Laravel\Fortify\TwoFactorAuthenticatable;

use function Illuminate\Events\queueable;

class User extends Authenticatable
{
    use Billable, HasFactory, HasUuids, Metable, Notifiable, SoftDeletes , TwoFactorAuthenticatable;

    protected $metaTable = 'users_meta';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'user_type',
        'country',
        'emailNotification',
        'terms',
        'google_id',
        'google_token',
        'connects',
        'otp',
        'two_factor_authentication',
        'image',
        'active_status',
        'time_zone',
        'strip_id',
        'rating',
        'review_count',
        'job_success',
        'profile_complete_score',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_id',
        'google_token',
        'stripe_id',
        'stripe_subscription',
        'otp',

    ];

    /**
     * The attributes that should be appended for serialization.
     */
    protected $appends = [
        'created_at_human',
        'avatar',
        'full_name',
        'skills',
        'educations',
        'language',
        'portfolios',
        'available_connects',
        'user_country_time',
        'payment_verified',
        'active_job_count',
        'active_offer_count',
        'hire_rate',
        'id_verified',
        'recent_reviews',
        'earned',
        'total_spent',
        'in_progress_offers',
        'profile_complete_percentage',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'job_success' => 'integer',
        ];
    }

    public function role()
    {
        return $this->belongsToMany(Role::class);
    }

    protected function education()
    {
        return $this->hasMany(Education::class);
    }

    protected function portfolio()
    {
        return $this->hasMany(Portfolio::class);
    }

    protected function job()
    {
        return $this->hasMany(JobPost::class);
    }

    protected function proposal()
    {
        return $this->hasMany(Proposal::class);
    }

    protected function language()
    {
        return $this->hasMany(Language::class);
    }

    protected function credit()
    {
        return $this->hasMany(Credit::class);
    }

    public function jobCategories()
    {
        return $this->hasMany(UsersJobCategory::class);
    }

    public function offer()
    {
        return $this->hasMany(Offer::class);
    }

    public function review()
    {
        return $this->hasMany(Review::class, 'reviewer_id');
    }

    public function IdentityVerification()
    {
        return $this->hasOne(IdentityVerification::class);
    }

    public function paymentMethods()
    {
        return $this->hasMany(PaymentMethod::class, 'user_id');
    }

    public function payment()
    {
        return $this->hasMany(Payment::class, 'user_id');
    }

    public function employHistory()
    {
        return $this->hasMany(EmployHistory::class, 'user_id');
    }

    // public function getProfileCompletePercentageAttribute()
    // {
    //     $profileCompleteScore = $this->profile_complete_score;
    //     $totalScore = 15;
    //     $percentage = ($profileCompleteScore / $totalScore) * 100;

    //     return $percentage;
    // }

    public function getProfileCompletePercentageAttribute()
    {
        // Define the required fields for profile completion
        $requiredFields = [
            'first_name',
            'last_name',
            'email',
            'password',
            'country',
            'image',
            'time_zone',
        ];

        // Define the user meta fields to check
        $userMetaFields = [
            'title',
            'profile_overview',
            'video_link',
            'skills',
            'visibility',
            'project_preference',
            'experience_level',
            'address_line1',
            'phone',
        ];

        // Initialize the completion counters
        $completedFields = 0;

        // Count completed required fields
        foreach ($requiredFields as $field) {
            if (! empty($this->$field)) {
                $completedFields++;
            }
        }

        // Check user meta fields
        foreach ($userMetaFields as $metaField) {
            // Check if the meta field is not null or empty
            if (! empty($this->metas->where('key', $metaField)->first())) {
                $completedFields++;
            }
        }

        // Check if the user has at least one portfolio, education, and language
        if ($this->portfolio()->count() > 0) {
            $completedFields++;
        }

        if ($this->education()->count() > 0) {
            $completedFields++;
        }

        if ($this->language()->count() > 0) {
            $completedFields++;
        }

        if ($this->jobCategories()->count() > 0) {
            $completedFields++;
        }

        if ($this->employHistory()->count() > 0) {
            $completedFields++;
        }

        if ($this->paymentMethods()->count() > 0) {
            $completedFields++;
        }

        // Total fields to check for completion
        $totalFields = count($requiredFields) + count($userMetaFields) + 6;

        // Calculate the completion percentage
        $completionPercentage = ($completedFields / $totalFields) * 100;

        return round($completionPercentage); // Return the rounded percentage
    }

    public function getTotalSpentAttribute()
    {
        return $this->payment()->where('type', 'credit')->sum('amount');
    }

    public function getEarnedAttribute()
    {
        $earned = 0;
        $earned = Payment::where('freelancer_id', $this->id)->where('type', 'debit')->sum('amount');

        return $earned;
    }

    // add user recent last 2 review
    public function getRecentReviewsAttribute()
    {
        if ($this->user_type == 'client') {
            return $this->review()->where('status', 'submitted')
                ->orderBy('created_at', 'desc')->limit(2)->get();
        } else {
            return $this->review()->where('status', 'submitted')
                ->orderBy('created_at', 'desc')->get();
        }
    }

    public function getInProgressOffersAttribute()
    {
        if ($this->user_type == 'client') {
            return $this->offer()->where('status', 'accepted')->orderBy('created_at', 'desc')->limit(2)->get();
        } else {
            return Offer::where('status', 'accepted')->where('freelancer_id', $this->id)->orderBy('created_at', 'desc')->get();
        }
    }

    public function getIdVerifiedAttribute()
    {
        return $this->IdentityVerification()->where('status', 'verified')->count() > 0 ? true : false;
    }

    public function getAvailableConnectsAttribute()
    {
        $credits = $this->credit()->where('status', 'active')->sum('available_connects');

        // return as integer
        return (int) $credits;
    }

    public function getPaymentVerifiedAttribute()
    {
        return $this->stripe_id != null ? true : false;
    }

    public function getActiveJobCountAttribute()
    {
        return $this->job()->where('status', '!=', 'draft')->count();
    }

    public function getActiveOfferCountAttribute()
    {
        if ($this->user_type == 'client') {
            return $this->offer()->where('status', '!=', 'draft')->count();
        } else {
            return Offer::where('status', '!=', 'draft')->where('freelancer_id', $this->id)->count();
        }
    }

    public function getHireRateAttribute()
    {

        if ($this->user_type == 'client') {
            $jobs = $this->job()->where('status', '!=', 'draft')->get();
            $totalJobs = $jobs->count();
            $totalOffers = $this->offer()->where('status', '!=', 'draft')->count();
            $totalSuccessOffers = $this->offer()->where('status', 'completed')->count();

            $totalProposals = 0;
            foreach ($jobs as $job) {
                $totalProposals += Proposal::where('job_post_id', $job->id)->where('status', '!=', 'draft')->count();
            }

            if ($totalJobs == 0 || $totalProposals == 0) {
                $hireRate = 0;
                $this->job_success = 0;
            } else {
                $hireRate = ($totalOffers / $totalProposals) * 100;
                $jobSuccess = ($totalSuccessOffers / $totalProposals) * 100;
                $this->job_success = $jobSuccess;
                $this->save();
            }
        } else {
            $totalOffers = Offer::where('status', '!=', 'draft')->where('freelancer_id', $this->id)->count();
            $totalSuccessOffers = Offer::where('status', 'completed')->where('freelancer_id', $this->id)->count();

            $totalProposals = $this->proposal()->where('status', '!=', 'draft')->count();

            if ($totalProposals == 0) {
                $hireRate = 0;
                $this->job_success = 0;
            } else {
                $hireRate = 0;
                $jobSuccess = ($totalSuccessOffers / $totalProposals) * 100;
                $this->job_success = $jobSuccess;
                $this->save();
            }
        }

        return $hireRate;
    }

    public function getEducationsAttribute()
    {
        return $this->education()->get();
    }

    public function getLanguageAttribute()
    {
        return $this->language()->get();
    }

    public function getPortfoliosAttribute()
    {
        return $this->portfolio()->where('status', 'active')->get();
    }

    public function getSkillsAttribute()
    {
        $metaData = $this->metas;
        $skillsJson = $metaData->where('key', 'skills')->first();
        if ($skillsJson == null) {
            return [];
        }
        $skillsArray = json_decode($skillsJson['value'], true);
        $skills = [];
        if ($skillsArray != null) {
            foreach ($skillsArray as $skill) {
                $skill = SkillCategory::find($skill);
                $skills[] = $skill->name;
            }
        }

        return $skills;
    }

    public function getActiveProposalCountAttribute()
    {
        return $this->proposals()->count();
    }

    public function getAvatarAttribute()
    {
        if ($avatar = $this->image) {
            return Storage::url($avatar);
        }

        return "https://ui-avatars.com/api/?name={$this->full_name}&color=ffffff&background=a0a2a3&size=512*512";
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getCreatedAtHumanAttribute(): string
    {
        return Carbon::parse($this->created_at)->format('M d, Y');
    }

    public function getUserCountryTimeAttribute(): string
    {
        if ($this->time_zone) {
            $city = $this->getCityFromTimezone($this->time_zone);
            $formattedTime = $this->getFormattedTime($this->time_zone);

            return "{$city} {$formattedTime}";
        }

        return 'Unknown time zone';
    }

    private function getCityFromTimezone(string $timezone): string
    {
        $parts = explode('/', $timezone);

        return isset($parts[1]) ? $parts[1] : 'Unknown Location';
    }

    private function getFormattedTime(string $timezone): string
    {
        return Carbon::now($timezone)->format('h:i A');
    }

    protected static function booted(): void
    {
        static::updated(queueable(function (User $customer) {
            if ($customer->hasStripeId()) {
                $customer->syncStripeCustomerDetails();
            }
        }));
    }

    public function scopeOrderByColumn($query, $column, $direction = 'asc')
    {
        return $query->orderBy($column, $direction);
    }

    /**
     * @param  mixed  $query
     * @return [type]
     */
    public function scopeFilter($query, array $filters)
    {
        $query->when($filters['user_type'] ?? null, function ($query, $userType) {
            $query->where('user_type', $userType);
        });

        $query->when($filters['searchParam'] ?? null, function ($query, $search) {
            $query->where(function ($query) use ($search) {
                $query->where('first_name', 'like', '%'.$search.'%')
                    ->orWhere('last_name', 'like', '%'.$search.'%')
                    ->orWhere('email', 'like', '%'.$search.'%')
                    ->orWhere(DB::raw("CONCAT(first_name, ' ', last_name)"), 'like', '%'.$search.'%');
            });
        });

        $query->when($filters['skillCategories'] ?? null, function ($query, $skillCategories) {
            $skillCategoriesArray = array_map('intval', explode(',', $skillCategories));
            $query->whereHas('metas', function ($query) use ($skillCategoriesArray) {
                $query->where('key', 'skills')
                    ->where(function ($query) use ($skillCategoriesArray) {
                        foreach ($skillCategoriesArray as $category) {
                            $query->orWhereJsonContains('value', $category);
                        }
                    });
            });
        });

        $query->when($filters['jobCategories'] ?? null, function ($query, $jobCategories) {
            $jobCategoriesArray = array_map('intval', explode(',', $jobCategories));
            $query->whereHas('jobCategories', function ($query) use ($jobCategoriesArray) {
                $query->where(function ($query) use ($jobCategoriesArray) {
                    foreach ($jobCategoriesArray as $category) {
                        $query->orWhere('job_category_id', $category);
                    }
                });
            });
        });

        $query->when($filters['minRate'] ?? null, function ($query, $minRate) {
            $query->where('job_success', '>=', $minRate);
        })->when($filters['maxRate'] ?? null, function ($query, $maxRate) {
            $query->where('job_success', '<=', $maxRate);
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
