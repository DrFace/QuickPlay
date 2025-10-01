<?php

namespace App\Repositories\All\EmployHistory;

use App\Models\EmployHistory;
use App\Repositories\Base\BaseRepository;

// repository Class
class EmployHistoryRepository extends BaseRepository implements EmployHistoryInterface
{
    /**
     * @var EmployHistory
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(EmployHistory $model)
    {
        parent::__construct($model);
        $this->model = $model;
    }
}
