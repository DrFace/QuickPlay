<?php

namespace App\Repositories\All\Offer;

use App\Models\Offer;
use App\Repositories\Base\BaseRepository;

// repository Class
class OfferRepository extends BaseRepository implements OfferInterface
{
    /**
     * @var Offer
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Offer $model)
    {
        $this->model = $model;
    }
}
