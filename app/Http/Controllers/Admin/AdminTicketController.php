<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Ticket\ReplyTicketInterface;
use App\Repositories\All\Ticket\TicketInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminTicketController extends Controller
{
    use UtilityTrait;

    public function __construct(protected TicketInterface $ticketRepository, protected ReplyTicketInterface $ReplyTicketRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->ReplyTicketRepository = $ReplyTicketRepository;
    }

    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'subject';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        $tickets = $this->ticketRepository->searchTickets($filters);

        return Inertia::render('Admin/Tickets/All/Index', [
            'tickets' => $tickets,
            'user' => Auth::user(),
            'filters' => $filters,
        ]);
    }
}
