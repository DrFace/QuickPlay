<?php

namespace App\Repositories\All\Education;

use App\Models\Education;
use App\Repositories\Base\BaseRepository;

// repository Class
class EducationRepository extends BaseRepository implements EducationInterface
{
    /**
     * @var Education
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Education $model)
    {
        $this->model = $model;
    }
}
