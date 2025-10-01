<?php

namespace App\Repositories\All\ProjectAttachment;

use App\Models\ProjectAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class ProjectAttachmentRepository extends BaseRepository implements ProjectAttachmentInterface
{
    /**
     * @var ProjectAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(ProjectAttachment $model)
    {
        $this->model = $model;
    }
}
