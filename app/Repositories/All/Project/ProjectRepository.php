<?php

namespace App\Repositories\All\Project;

use App\Models\Project;
use App\Repositories\Base\BaseRepository;

// repository Class
class ProjectRepository extends BaseRepository implements ProjectInterface
{
    /**
     * @var Project
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Project $model)
    {
        $this->model = $model;
    }
}
