<?php

namespace App\Repositories\All\Ticket;

use App\Repositories\Base\EloquentRepositoryInterface;

// Interface
interface TicketInterface extends EloquentRepositoryInterface
{
    public function getAllTickets(array $filters = []);

    public function searchTickets(array $filters = []);
}
