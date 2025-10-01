<?php

namespace App\Repositories\All\Portfolio;

use App\Models\Portfolio;
use App\Repositories\Base\BaseRepository;

// repository Class
class PortfolioRepository extends BaseRepository implements PortfolioInterface
{
    /**
     * @var Portfolio
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Portfolio $model)
    {
        $this->model = $model;
    }
}
