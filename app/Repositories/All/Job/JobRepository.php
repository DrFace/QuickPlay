<?php

namespace App\Repositories\All\Job;

use App\Models\JobPost;
use App\Repositories\Base\BaseRepository;

// repository Class
class JobRepository extends BaseRepository implements JobInterface
{
    /**
     * @var JobPost
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(JobPost $model)
    {
        $this->model = $model;
    }
}
