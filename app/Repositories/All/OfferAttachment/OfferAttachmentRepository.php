<?php

namespace App\Repositories\All\OfferAttachment;

use App\Models\OfferAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class OfferAttachmentRepository extends BaseRepository implements OfferAttachmentInterface
{
    /**
     * @var OfferAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(OfferAttachment $model)
    {
        $this->model = $model;
    }
}
