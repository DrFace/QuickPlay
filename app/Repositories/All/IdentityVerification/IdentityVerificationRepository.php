<?php

namespace App\Repositories\All\IdentityVerification;

use App\Models\IdentityVerification;
use App\Repositories\Base\BaseRepository;

// repository Class
class IdentityVerificationRepository extends BaseRepository implements IdentityVerificationInterface
{
    /**
     * @var IdentityVerification
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(IdentityVerification $model)
    {
        $this->model = $model;
    }
}
