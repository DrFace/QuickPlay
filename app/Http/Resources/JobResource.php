<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JobResource extends JsonResource
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
            'title' => $this->title,
            'public_url' => $this->public_url,
            'job_category' => $this->job_category,
            'created_at_human_ago' => $this->created_at_human_ago,
            'updated_at_human_ago' => $this->updated_at_human_ago,
            'description' => $this->description,
            'proposal_count' => $this->proposal_count,
            'chat_count' => $this->chat_count,
            'offer_count' => $this->offer_count,
            'scope_duration' => $this->scope_duration,
            'scope_experience' => $this->scope_experience,
            'scope_size' => $this->scope_size,
            'skill_list' => $this->skill_list,
            'budget' => $this->budget,
            'status' => $this->status,
            'created_at_human' => $this->created_at_human,
            'client' => ClientResource::make($this->client),
            'hire_rate' => $this->hire_rate,
            'attachments' => $this->attachments,
            'is_favorite' => $this->is_favorite,
        ];
    }
}
