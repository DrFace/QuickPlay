<?php

namespace App\Repositories\All\Chat;

use App\Models\Chat;
use App\Repositories\Base\BaseRepository;

// repository Class
class ChatRepository extends BaseRepository implements ChatInterface
{
    /**
     * @var Chat
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Chat $model)
    {
        $this->model = $model;
    }
}
