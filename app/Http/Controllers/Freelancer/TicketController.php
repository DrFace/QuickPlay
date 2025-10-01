<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\TicketRequest;
use App\Notifications\AppNotification\CreateNotification;
use App\Repositories\All\Ticket\TicketInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class TicketController extends Controller
{
    protected $ticketRepository;

    public function __construct(TicketInterface $ticketRepository)
    {
        $this->ticketRepository = $ticketRepository;
    }

    public function ticket()
    {

        $tickets = $this->ticketRepository->getByColumn(['user_id' => Auth::id()]);

        $tickets = $tickets->sortByDesc('created_at')->values();

        return Inertia::render('Freelancer/Ticket/Index', [
            'user' => Auth::user(),
            'tickets' => $tickets,
        ]);

    }

    public function store(TicketRequest $request)
    {
        $data = $request->all();

        $ticket = $this->ticketRepository->create([
            'user_id' => Auth::id(),
            'subject' => $data['subject'],
            'category' => $data['category'],
            'description' => $data['description'],
        ]);
        $data = 'Ticket';
        $user = Auth::user();
        try {
            Notification::send($user, new CreateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'There was an error creating the ticket: '.$e->getMessage());
        }

        return redirect()->back()->with('success', 'You Have Successfully Submitted a Ticket');
    }

    public function reply($ticketId)
    {
        $ticket = $this->ticketRepository->findByColumn(['id' => $ticketId, 'user_id' => Auth::id()]);

        if (! $ticket) {
            return redirect()->route('freelancer.ticket.index')->with('error', 'Ticket not found.');
        }

        return Inertia::render('Freelancer/Ticket/ReplyTicket', [
            'ticket' => $ticket,
            'user' => Auth::user(),
        ]);
    }
}
