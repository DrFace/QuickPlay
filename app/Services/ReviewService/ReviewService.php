<?php

namespace App\Services\ReviewService;

use App\Repositories\All\User\UserInterface;

class ReviewService
{
    public function __construct(
        protected UserInterface $userInterface,
    ) {}

    public function ratingUpdate(string $userId, float $newRating)
    {
        $user = $this->userInterface->findByUuId($userId);
        $rating = $user->rating;
        $review_count = $user->review_count;
        if ($rating != 0 || $newRating != 0) {
            $new_rating = ($rating * $review_count + $newRating) / ($review_count + 1);
        } else {
            $new_rating = 0;
        }
        $user->update([
            'rating' => $new_rating,
            'review_count' => $review_count + 1,
        ]);
    }
}
