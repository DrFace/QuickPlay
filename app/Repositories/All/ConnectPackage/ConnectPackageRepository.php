<?php

namespace App\Repositories\All\ConnectPackage;

use App\Models\ConnectPackage;
use App\Repositories\Base\BaseRepository;

// repository Class
class ConnectPackageRepository extends BaseRepository implements ConnectPackageInterface
{
    /**
     * @var ConnectPackage
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(ConnectPackage $model)
    {
        $this->model = $model;
    }
}
