<?php

namespace App\Repositories\All\OfferMilestone;

use App\Models\OfferMilestone;
use App\Repositories\Base\BaseRepository;

// repository Class
class OfferMilestoneRepository extends BaseRepository implements OfferMilestoneInterface
{
    /**
     * @var OfferMilestone
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(OfferMilestone $model)
    {
        $this->model = $model;
    }
}
