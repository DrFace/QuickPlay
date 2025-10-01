<?php

namespace App\Repositories\All\JobAttachment;

use App\Models\JobAttachment;
use App\Repositories\Base\BaseRepository;

// repository Class
class JobAttachmentRepository extends BaseRepository implements JobAttachmentInterface
{
    /**
     * @var JobAttachment
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(JobAttachment $model)
    {
        $this->model = $model;
    }
}
