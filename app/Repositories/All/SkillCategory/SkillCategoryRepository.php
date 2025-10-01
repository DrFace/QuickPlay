<?php

namespace App\Repositories\All\SkillCategory;

use App\Models\SkillCategory;
use App\Repositories\Base\BaseRepository;

// repository Class
class SkillCategoryRepository extends BaseRepository implements SkillCategoryInterface
{
    /**
     * @var SkillCategory
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(SkillCategory $model)
    {
        $this->model = $model;
    }
}
