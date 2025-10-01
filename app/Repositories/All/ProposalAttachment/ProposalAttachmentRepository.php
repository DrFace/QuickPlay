<?php

namespace App\Repositories\All\ProposalAttachment;

use App\Models\ProposalAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class ProposalAttachmentRepository extends BaseRepository implements ProposalAttachmentInterface
{
    /**
     * @var ProposalAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(ProposalAttachment $model)
    {
        $this->model = $model;
    }
}
