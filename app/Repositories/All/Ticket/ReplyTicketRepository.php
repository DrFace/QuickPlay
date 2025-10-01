<?php

namespace App\Repositories\All\Ticket;

use App\Models\TicketReply;
use App\Repositories\Base\BaseRepository;

// repository Class
class ReplyTicketRepository extends BaseRepository implements ReplyTicketInterface
{
    /**
     * @var TicketReply
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(TicketReply $model)
    {
        $this->model = $model;
    }
}
