<?php

namespace App\Repositories\All\BalanceRequest;

use App\Models\BalanceRequest;
use App\Repositories\Base\BaseRepository;

// repository Class
class BalanceRequestRepository extends BaseRepository implements BalanceRequestInterface
{
    /**
     * @var BalanceRequest
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(BalanceRequest $model)
    {
        $this->model = $model;
    }
}
