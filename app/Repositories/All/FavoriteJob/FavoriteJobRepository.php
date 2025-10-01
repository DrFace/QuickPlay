<?php

namespace App\Repositories\All\FavoriteJob;

use App\Models\FavoriteJobs;
use App\Repositories\Base\BaseRepository;

// repository Class
class FavoriteJobRepository extends BaseRepository implements FavoriteJobInterface
{
    /**
     * @var FavoriteJobs
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(FavoriteJobs $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }
}
