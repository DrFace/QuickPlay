<?php

namespace App\Repositories\All\Ticket;

use App\Models\Ticket;
use App\Repositories\Base\BaseRepository;

// repository Class
class TicketRepository extends BaseRepository implements TicketInterface
{
    /**
     * @var Ticket
     */
    protected $model;

    /**
     * BaseRepository constructor.
     */
    public function __construct(Ticket $model)
    {
        $this->model = $model;
    }

    public function getAllTickets(array $filters = [])
    {
        return Ticket::all();
    }

    public function searchTickets(array $filters = [])
    {
        return $this->model->searchTickets($filters);
    }
}
