<?php

namespace App\Repositories\All\Message;

use App\Models\Message;
use App\Repositories\Base\BaseRepository;

// repository Class
class MessageRepository extends BaseRepository implements MessageInterface
{
    /**
     * @var Message
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Message $model)
    {
        $this->model = $model;
    }
}
