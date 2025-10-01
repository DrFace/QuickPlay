<?php

namespace App\Repositories\All\Payment;

use App\Models\Payment;
use App\Repositories\Base\BaseRepository;

// repository Class
class PaymentRepository extends BaseRepository implements PaymentInterface
{
    /**
     * @var Payment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Payment $model)
    {
        $this->model = $model;
    }
}
