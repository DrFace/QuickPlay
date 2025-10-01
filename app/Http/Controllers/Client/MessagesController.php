<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Changes\ChangesRequest;
use App\Http\Resources\ChatResource;
use App\Http\Traits\UtilityTrait;
use App\Jobs\SendMessage;
use App\Notifications\AppNotification\PublicNotification;
use App\Notifications\ChangeRequestSubmitted\ProjectChangeRequestNotification;
use App\Repositories\All\Chat\ChatInterface;
use App\Repositories\All\Message\MessageInterface;
use App\Repositories\All\MessageAttachment\MessageAttachmentInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class MessagesController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected ChatInterface $chatInterface,
        protected MessageInterface $messageInterface,
        protected ProposalInterface $proposalInterface,
        protected OfferInterface $offerInterface,
        protected UserInterface $userInterface,
        protected MessageAttachmentInterface $messageAttachmentInterface,

    ) {}

    /**
     * Method index
     *
     * @return void
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';

        return Inertia::render('Client/Messages/Index', [
            'user' => Auth::user(),
            'filters' => $filters,
            'chats' => ChatResource::collection($this->chatInterface->filterWithParam($filters, ['freelancer'], ['client_id' => Auth::id()])),
        ]);
    }

    public function show(string $id, Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';

        $proposal = $this->proposalInterface->findByColumn(['id' => $id]);

        $chat = $this->chatInterface->findByColumn([
            'proposal_id' => $proposal->id,
        ]);

        if (! $chat) {
            $chat = $this->chatInterface->create([
                'proposal_id' => $proposal->id,
                'job_post_id' => $proposal->job_post_id,
                'freelancer_id' => $proposal->user_id,
                'client_id' => Auth::id(),
            ]);
        }

        $messages = $this->messageInterface->getByColumn(
            ['chat_id' => $chat->id],
            ['*'],
            ['sender', 'receiver']
        );

        $receiver = $this->userInterface->findByColumn(['id' => $proposal->user_id]);
        $offer = $this->offerInterface->findByColumn(['proposal_id' => $proposal->id]);

        return Inertia::render('Client/Messages/Index', [
            'user' => Auth::user(),
            'receiver' => $receiver,
            'chat_id' => $chat->id,
            'messages' => $messages,
            'selectedChat' => $chat,
            'chats' => ChatResource::collection($this->chatInterface->filterWithParam($filters, ['freelancer'], ['client_id' => Auth::id()])),
            'proposal' => $proposal,
            'offer' => $offer,
        ]);
    }

    public function sendMessage(Request $request)
    {
        // dd($request->all());

        if ($request->attachment) {
            $data = $request->validate([
                'chat_id' => 'required',
                'message' => 'nullable',
                'attachment' => 'required',
            ]);
        } else {
            $data = $request->validate([
                'chat_id' => 'required',
                'message' => 'required',
            ]);
        }

        $receiver_id = $this->chatInterface->findByColumn(['id' => $data['chat_id']])->freelancer_id;

        $message = $this->messageInterface->create([
            'chat_id' => $data['chat_id'],
            'sender_id' => Auth::id(),
            'receiver_id' => $receiver_id,
            'message' => $data['message'],
        ]);

        SendMessage::dispatch($message);
        // dd(($request->attachment));
        if ($request->attachment) {
            $file = $request->file('attachment');
            $path = $file->store('message', 'public');
            $this->messageAttachmentInterface->create([
                'message_id' => $message->id,
                'type' => $file->getClientMimeType(),
                'file_name' => $file->getClientOriginalName(),
                'path' => $path,
                'status' => 'active',
                'size' => $file->getSize(),
            ]);
        }

        return redirect()->back();
    }

    public function getMessages($chat_id)
    {
        // dd($chat_id);
        $messages = $this->messageInterface->getByColumn(
            ['chat_id' => $chat_id],
            ['*'],
            ['sender', 'receiver']);

        return response()->json($messages);
    }

    public function requestChanges(ChangesRequest $request)
    {

        $offer = $this->offerInterface->findByColumn(['id' => $request->offer_id]);
        $chat = $this->chatInterface->findByColumn([
            'proposal_id' => $offer->proposal_id,
        ]);

        if (! $chat) {
            $chat = $this->chatInterface->create([
                'proposal_id' => $offer->proposal_id,
                'job_post_id' => $offer->job_post_id,
                'freelancer_id' => $offer->freelancer_id,
                'client_id' => Auth::id(),
            ]);
        }

        $message = $this->messageInterface->create([
            'chat_id' => $chat->id,
            'sender_id' => Auth::id(),
            'receiver_id' => $offer->freelancer_id,
            'message' => $request->message,
        ]);
        try {
            Notification::send($offer->freelancer, new ProjectChangeRequestNotification($offer->user->first_name, $offer->contract_title, $offer->freelancer->first_name));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }
        $data1 = 'Changes Requested Successfully';
        try {
            Notification::send($offer->user, new PublicNotification($data1));
        } catch (\Exception $e) {
        }

        return redirect()->back()->with('success', ['Changes Requested Successfully', $this->randomKey()]);
    }
}
