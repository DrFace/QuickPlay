<?php

namespace App\Repositories\All\OfferRecentActivity;

use App\Models\OfferRecentActivity;
use App\Repositories\Base\BaseRepository;

// repository Class
class OfferRecentActivityRepository extends BaseRepository implements OfferRecentActivityInterface
{
    /**
     * @var OfferRecentActivity
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(OfferRecentActivity $model)
    {
        $this->model = $model;
    }
}
