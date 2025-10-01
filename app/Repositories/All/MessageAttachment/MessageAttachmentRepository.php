<?php

namespace App\Repositories\All\MessageAttachment;

use App\Models\MessageAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class MessageAttachmentRepository extends BaseRepository implements MessageAttachmentInterface
{
    /**
     * @var MessageAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(MessageAttachment $model)
    {
        $this->model = $model;
    }
}
