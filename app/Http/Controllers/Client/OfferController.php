<?php

namespace App\Http\Controllers\Client;

use App\Enums\MainStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Requests\Offer\OfferDescriptionRequest;
use App\Http\Requests\Offer\OfferPriceRequest;
use App\Http\Requests\Offer\OfferRequest;
use App\Http\Requests\Offer\OfferTitleRequest;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferAttachment\OfferAttachmentInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OfferController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected ProposalInterface $proposalInterface,
        protected JobInterface $jobInterface,
        protected OfferAttachmentInterface $offerAttachmentInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
    ) {}

    /**
     * Method create
     *
     * @return void
     */
    public function create(string $job, string $id)
    {
        $proposal = $this->proposalInterface->findByColumn(['id' => $id], ['*'], ['attachments', 'milestones', 'freelancer']);

        $offer = $this->offerInterface->findByColumn([
            'job_post_id' => $job,
            'proposal_id' => $id,
            'user_id' => Auth::id(),
        ], ['*'], ['attachments', 'milestones']);

        $jobPost = $this->jobInterface->findByColumn(['id' => $job]);

        if (! $offer) {
            $offer = $this->offerInterface->create([
                'user_id' => Auth::id(),
                'job_post_id' => $job,
                'proposal_id' => $id,
                'status' => 'draft',
                'freelancer_id' => $proposal->user_id,
                'offer_price' => $proposal->bid_amount,
                'contract_title' => $jobPost->title,
                'contract_description' => $jobPost->description,
            ]);
        }

        return Inertia::render('Client/Offer/Edit/Index', [
            'offer' => $offer,
            'type' => $offer->status == 'draft' ? 'create' : 'edit',
            'user' => Auth::user(),
            'proposal' => $proposal,
        ]);
    }

    public function priceUpdate(string $id, OfferPriceRequest $request)
    {
        $this->offerInterface->updateOrCreate(['id' => $id], ['offer_price' => $request->offer_price]);

        return redirect()->back()->with('success', ['Offer Price Updated Successfully.', $this->randomKey()]);
    }

    public function titleUpdate(string $id, OfferTitleRequest $request)
    {
        $this->offerInterface->updateOrCreate(['id' => $id], ['contract_title' => $request->title]);

        return redirect()->back()->with('success', ['Offer title Updated Successfully.', $this->randomKey()]);
    }

    public function descriptionUpdate(string $id, OfferDescriptionRequest $request)
    {
        $this->offerInterface->updateOrCreate(['id' => $id], ['contract_description' => $request->description]);

        return redirect()->back()->with('success', ['Offer Description Updated Successfully.', $this->randomKey()]);
    }

    public function update(string $id, OfferRequest $request)
    {
        // dd($request->all());
        $offer = $this->offerInterface->findByColumn(['id' => $id]);

        $milestones = $request->milestones;

        if ($request->paid_type == 'Milestone') {
            $lastMilestone = end($milestones);
            $totalAmount = 0;
            foreach ($milestones as $milestone) {
                $totalAmount += $milestone['amount'];
            }
            if ($totalAmount != $offer->offer_price) {
                return redirect()->back()->with('error', ['Total milestone amount should be equal to offer price.', $this->randomKey()]);
            }
        }
        $deleteMilestone = $this->offerMilestoneInterface->getByColumn(['offer_id' => $offer->id]);
        foreach ($deleteMilestone as $del) {
            $del->delete();
        }

        $offer->update([
            'payment_type' => $request->paid_type,
            'status' => 'draft',
            'due_date' => $request->paid_type == 'Milestone' ? $lastMilestone['dueDate'] : $request->dueDate,
        ]);
        $data = $request->all();
        if ($request->attachments != null) {

            foreach ($request->attachments as $file) {
                if (! is_array($file)) {
                    $path = $file->store('offer', 'public');
                    $this->offerAttachmentInterface->create([
                        'offer_id' => $offer->id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]);
                }
            }
        }

        if ($data['paid_type'] == 'Milestone') {
            foreach ($data['milestones'] as $milestone) {
                $this->offerMilestoneInterface->create([
                    'offer_id' => $offer->id,
                    'due_date' => $milestone['dueDate'],
                    'description' => $milestone['description'],
                    'amount' => $milestone['amount'],
                    'status' => MainStatusEnum::Active->value,
                ]);
            }
        }

        return redirect()->route('client.hire', ['offer' => $offer->id]);
    }

    public function delete(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id]);
        $offer->delete();

        return redirect()->route('client.job.show', ['job' => $offer->job_post_id])->with('success', ['Offer Deleted Successfully.', $this->randomKey()]);
    }

    public function show(string $id)
    {
        $offer = $this->offerInterface->findByColumn(['id' => $id], ['*'], ['attachments', 'milestones', 'jobPost', 'proposal']);

        return Inertia::render('Client/Offer/Show/Index', [
            'offer' => $offer,
            'user' => Auth::user(),
        ]);
    }
}
