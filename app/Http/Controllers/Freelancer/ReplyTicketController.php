<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\TicketReplyRequest;
use App\Repositories\All\Ticket\ReplyTicketInterface;
use App\Repositories\All\Ticket\TicketInterface;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReplyTicketController extends Controller
{
    protected $ticketRepository;

    protected $ReplyTicketRepository;

    public function __construct(TicketInterface $ticketRepository, ReplyTicketInterface $ReplyTicketRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->ReplyTicketRepository = $ReplyTicketRepository;

    }

    public function replies($id)
    {
        $ticket = $this->ticketRepository->findByColumn(['id' => $id], ['*'], ['creator']);

        $ticketReplies = $this->ReplyTicketRepository->getByColumn(['ticket_id' => $id], ['*'], ['rcreator']);

        return Inertia::render('Freelancer/Ticket/ReplyTicket', [
            'ticket' => $ticket,
            'ticket_replies' => $ticketReplies,
            'user' => Auth::user(),
        ]);
    }

    public function storeReply($id, TicketReplyRequest $request)
    {
        $data = $request->validated();
        $ticket = $this->ticketRepository->findByColumn(['id' => $id]);

        if ($ticket) {
            $this->ReplyTicketRepository->create([
                'ticket_id' => $id,
                'user_id' => Auth::id(),
                'reply' => $data['reply'],
            ]);
        } else {
            return redirect()->back()->with('error', 'Ticket not found.');
        }

        return redirect()->back()->with('success', 'Reply Submitted Successfully.');
    }
}
