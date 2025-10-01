<?php

namespace App\Repositories\All\Review;

use App\Models\Review;
use App\Repositories\Base\BaseRepository;

// repository Class
class ReviewRepository extends BaseRepository implements ReviewInterface
{
    /**
     * @var ClientReview
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Review $model)
    {
        $this->model = $model;
    }
}
