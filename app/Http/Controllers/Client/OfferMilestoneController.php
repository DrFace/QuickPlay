<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Milestone\ClientCreateMilestoneRequest;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\Job\JobInterface;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferAttachment\OfferAttachmentInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\Proposal\ProposalInterface;
use App\Services\MilestoneService\MilestoneService;

class OfferMilestoneController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected ProposalInterface $proposalInterface,
        protected JobInterface $jobInterface,
        protected OfferAttachmentInterface $offerAttachmentInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected MilestoneService $milestoneService,
    ) {}

    /**
     * Method create
     *
     * @return void
     */
    public function createNewMilestone(string $id, ClientCreateMilestoneRequest $request)
    {

        // dd($request->all());
        try {
            $selectedMilestone = $this->offerMilestoneInterface->findById($id);
            $allMilestones = $this->offerMilestoneInterface->getByColumn(['offer_id' => $selectedMilestone->offer_id]);
            $offer = $this->offerInterface->findByUuId($selectedMilestone->offer_id);

            foreach ($allMilestones as $index => $milestone) {
                if ($milestone->id == $selectedMilestone->id) {
                    $nextMilestone = $allMilestones[$index + 1] ?? null;
                    break;
                }
            }

            if ($nextMilestone !== null) {
                $created_at = $this->milestoneService->betweenTwoDates($selectedMilestone->created_at, $nextMilestone->created_at);

                $this->offerMilestoneInterface->create([
                    'offer_id' => $selectedMilestone->offer_id,
                    'description' => $request->description,
                    'due_date' => $request->due_date,
                    'amount' => $request->amount,
                    'status' => 'active',
                    'project_status' => 'pending',
                    'created_at' => $created_at,
                    'updated_at' => $created_at,
                ]);
            } else {
                $this->offerMilestoneInterface->create([
                    'offer_id' => $selectedMilestone->offer_id,
                    'description' => $request->description,
                    'due_date' => $request->due_date,
                    'amount' => $request->amount,
                    'status' => 'active',
                    'project_status' => 'pending',
                ]);
            }

            $offer->update([
                'offer_price' => $offer->offer_price + $request->amount,
            ]);

            return redirect()->back()->with('success', ['New Milestone Created Successfully', $this->randomKey()]);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ['Something went wrong', $this->randomKey()]);
        }
    }

    /**
     * Method editMilestone
     *
     * @return void
     */
    public function editMilestone(string $id, ClientCreateMilestoneRequest $request)
    {
        // dd($request->all());
        try {
            $milestone = $this->offerMilestoneInterface->findById($id);
            $offer = $this->offerInterface->findByUuId($milestone->offer_id);
            if ($milestone->status == 'active' || $milestone->status == 'requested') {

                if ($request->status == 'deleted') {

                    if ($request->type == 'edit') {
                        $offer->update([
                            'offer_price' => $offer->offer_price - $milestone->amount,
                        ]);
                        $offer->save();
                    }
                    $milestone->delete();

                    return redirect()->back()->with('success', ['Milestone Deleted Successfully', $this->randomKey()]);
                } else {
                    $milestone->update([
                        'due_date' => $request->due_date,
                        'description' => $request->description,
                        'amount' => $request->amount,
                        'status' => $request->status,
                    ]);
                    if ($request->type == 'view') {
                        $offer->update([
                            'offer_price' => $offer->offer_price + $request->amount,
                        ]);
                        $offer->save();
                    }

                    return redirect()->back()->with('success', ['Milestone Updated Successfully', $this->randomKey()]);
                }
            } else {
                return redirect()->back()->with('error', ['Milestone is already paid', $this->randomKey()]);
            }
        } catch (\Exception $e) {
            return redirect()->back()->with('error', ['Something went wrong', $this->randomKey()]);
        }
    }
}
