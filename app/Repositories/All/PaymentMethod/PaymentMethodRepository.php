<?php

namespace App\Repositories\All\PaymentMethod;

use App\Models\PaymentMethod;
use App\Repositories\Base\BaseRepository;

// repository Class
class PaymentMethodRepository extends BaseRepository implements PaymentMethodInterface
{
    /**
     * @var PaymentMethod
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(PaymentMethod $model)
    {
        $this->model = $model;
    }
}
