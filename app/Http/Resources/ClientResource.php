<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClientResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        // return parent::toArray($request);

        return [
            'id' => $this->id,
            'active_status' => $this->active_status,
            'avatar' => $this->avatar,
            'country' => $this->country,
            'time_zone' => $this->time_zone,
            'created_at_human' => $this->created_at_human,
            'full_name' => $this->full_name,
            'user_type' => $this->user_type,
            'user_country_time' => $this->user_country_time,
            'payment_verified' => $this->payment_verified,
            'active_job_count' => $this->active_job_count,
            'active_offer_count' => $this->active_offer_count,
            'hire_rate' => $this->hire_rate,
            'recent_reviews' => $this->recent_reviews,
            'rating' => $this->rating,
            'earned' => $this->earned,
            'total_spent' => $this->total_spent,
            'review_count' => $this->review_count,
        ];
    }
}
