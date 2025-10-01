<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AdminClientResource extends JsonResource
{
    /**
     * Transform the resource collection into an array.
     *
     * @return array<int|string, mixed>
     */
    public function toArray(Request $request): array
    {
        return parent::toArray($request);

        // return [
        //     'id' => $this->id,
        //     'first_name' => $this->first_name,
        //     'last_name' => $this->last_name,
        //     'email' => $this->email,
        //     'active_status' => $this->active_status,
        //     'avatar' => $this->avatar,
        //     'country' => $this->country,
        //     'created_at_human' => $this->created_at_human,
        //     'full_name' => $this->full_name,
        //     'user_type' => $this->user_type,
        // ];
    }
}
