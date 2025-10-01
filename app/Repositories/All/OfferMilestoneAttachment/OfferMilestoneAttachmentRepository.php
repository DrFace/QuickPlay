<?php

namespace App\Repositories\All\OfferMilestoneAttachment;

use App\Models\OfferMilestoneAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class OfferMilestoneAttachmentRepository extends BaseRepository implements OfferMilestoneAttachmentInterface
{
    /**
     * @var OfferMilestoneAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(OfferMilestoneAttachment $model)
    {
        $this->model = $model;
    }
}
