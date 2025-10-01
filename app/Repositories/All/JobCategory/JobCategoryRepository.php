<?php

namespace App\Repositories\All\JobCategory;

use App\Models\JobCategory;
use App\Repositories\Base\BaseRepository;

// repository Class
class JobCategoryRepository extends BaseRepository implements JobCategoryInterface
{
    /**
     * @var JobCategory
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(JobCategory $model)
    {
        $this->model = $model;
    }
}
