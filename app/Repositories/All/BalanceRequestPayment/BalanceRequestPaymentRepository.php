<?php

namespace App\Repositories\All\BalanceRequestPayment;

use App\Models\BalanceRequestPayments;
use App\Repositories\Base\BaseRepository;

// repository Class
class BalanceRequestPaymentRepository extends BaseRepository implements BalanceRequestPaymentInterface
{
    /**
     * @var BalanceRequestPayments
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(BalanceRequestPayments $model)
    {
        $this->model = $model;
    }
}
