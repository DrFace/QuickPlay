<?php

namespace App\Repositories\All\Contract;

use App\Models\Contract;
use App\Repositories\Base\BaseRepository;

// repository Class
class ContractRepository extends BaseRepository implements ContractInterface
{
    /**
     * @var Contract
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Contract $model)
    {
        $this->model = $model;
    }
}
