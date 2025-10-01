<?php

namespace App\Repositories\All\UserJobCategory;

use App\Models\UsersJobCategory;
use App\Repositories\Base\BaseRepository;

// repository Class
class UserJobCategoryRepository extends BaseRepository implements UserJobCategoryInterface
{
    /**
     * @var UsersJobCategory
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(UsersJobCategory $model)
    {
        $this->model = $model;
    }
}
