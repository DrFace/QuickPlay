<?php

namespace App\Repositories\All\SportsCategory;

use App\Models\SportsCategory;
use App\Repositories\Base\BaseRepository;

class SportsCategoryRepository extends BaseRepository implements SportsCategoryInterface
{
    /**
     * @var SportsCategory
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(SportsCategory $model)
    {
        $this->model = $model;
    }
}
