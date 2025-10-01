<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Resources\ChatResource;
use App\Http\Traits\UtilityTrait;
use App\Jobs\SendMessage;
use App\Repositories\All\Chat\ChatInterface;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Message\MessageInterface;
use App\Repositories\All\MessageAttachment\MessageAttachmentInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
        protected JobInterface $jobInterface,
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

        return Inertia::render('Freelancer/Messages/Index', [
            'user' => Auth::user(),
            'filters' => $filters,
            'chats' => ChatResource::collection($this->chatInterface->filterWithParam($filters, ['client'], ['freelancer_id' => Auth::id()])),
        ]);
    }

    public function show(string $id, Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page');
        $filters['sortBy'] = $filters['sortBy'] ?? 'created_at';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'desc';

        $proposal = $this->proposalInterface->findByUuId($id);

        $chat = $this->chatInterface->findByColumn([
            'proposal_id' => $proposal->id,
        ]);

        if (! $chat) {
            return redirect()->route('freelancer.messages')->with('error', ['Chat not found', $this->randomKey()]);
        }

        $messages = $this->messageInterface->getByColumn(
            ['chat_id' => $chat->id],
            ['*'],
            ['sender', 'receiver']);

        $job = $this->jobInterface->findByUuId($proposal->job_post_id);

        $receiver = $this->userInterface->findByColumn(['id' => $job->user_id]);
        $offer = $this->offerInterface->findByColumn(['proposal_id' => $proposal->id]);

        return Inertia::render('Freelancer/Messages/Index', [
            'user' => Auth::user(),
            'receiver' => $receiver,
            'chat_id' => $chat->id,
            'messages' => $messages,
            'chats' => ChatResource::collection($this->chatInterface->filterWithParam($filters, ['client'], ['freelancer_id' => Auth::id()])),
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

        $receiver_id = $this->chatInterface->findByUuId($data['chat_id'])->client_id;

        $message = $this->messageInterface->create([
            'chat_id' => $data['chat_id'],
            'sender_id' => Auth::id(),
            'receiver_id' => $receiver_id,
            'message' => $data['message'],
        ]);

        SendMessage::dispatch($message);
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
            ['sender', 'receiver']
        );

        return response()->json($messages);
    }
}
