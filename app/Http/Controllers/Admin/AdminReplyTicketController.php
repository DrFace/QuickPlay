<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ticket\TicketReplyRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\TicketReplyNotification\AdminTicketReplyNotification;
use App\Repositories\All\Ticket\ReplyTicketInterface;
use App\Repositories\All\Ticket\TicketInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class AdminReplyTicketController extends Controller
{
    use UtilityTrait;

    protected $ticketRepository;

    protected $ReplyTicketRepository;

    public function __construct(TicketInterface $ticketRepository, ReplyTicketInterface $ReplyTicketRepository)
    {
        $this->ticketRepository = $ticketRepository;
        $this->ReplyTicketRepository = $ReplyTicketRepository;
    }

    public function show($id)
    {
        $ticket = $this->ticketRepository->findByColumn(['id' => $id], ['*'], ['creator']);
        $ticketReplies = $this->ReplyTicketRepository->getByColumn(['ticket_id' => $id], ['*'], ['rcreator']);

        return Inertia::render('Admin/Tickets/Show/Index', [
            'ticket' => $ticket,
            'ticket_replies' => $ticketReplies,
            'user' => Auth::user(),
        ]);
    }

    public function replies($id)
    {
        $ticket = $this->ticketRepository->findByColumn(['id' => $id]);
        $ticketReplies = $this->ReplyTicketRepository->getByColumn(['ticket_id' => $id]);

        return Inertia::render('Admin/Tickets/Show/Index', [
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
        try {
            Notification::send($ticket->user, new AdminTicketReplyNotification($ticket->user->first_name, $ticket->subject));
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', ['Reply Submitted Successfully.', $this->randomKey()]);
    }

    public function updateStatus($id, TicketReplyRequest $request)
    {
        $request->validate([
            'status' => 'required|string|in:active,inactive,closed',
        ]);

        $ticket = $this->ticketRepository->findByColumn(['id' => $id]);

        if (! $ticket) {
            return redirect()->route('Admin/Tickets/Show/Index')->withErrors(['ticket' => 'Ticket not found']);
        }

        $ticket->status = $request->input('status');
        $ticket->save();

        return redirect()->back()->with('success', ['Ticket Status Updated Successfully.', $this->randomKey()]);
    }
}
