<?php

namespace App\Repositories\All\Credit;

use App\Models\Credit;
use App\Repositories\Base\BaseRepository;

// repository Class
class CreditRepository extends BaseRepository implements CreditInterface
{
    /**
     * @var Credit
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Credit $model)
    {
        $this->model = $model;
    }
}
