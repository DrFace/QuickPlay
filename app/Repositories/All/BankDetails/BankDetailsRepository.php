<?php

namespace App\Repositories\All\BankDetails;

use App\Models\BankDetails;
use App\Repositories\Base\BaseRepository;

// repository Class
class BankDetailsRepository extends BaseRepository implements BankDetailsInterface
{
    /**
     * @var BankDetails
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(BankDetails $model)
    {
        $this->model = $model;
    }
}
