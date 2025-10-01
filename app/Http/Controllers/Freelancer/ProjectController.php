<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Project\ProjectRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\PublicNotification;
use App\Repositories\All\Offer\OfferInterface;
use App\Repositories\All\OfferMilestone\OfferMilestoneInterface;
use App\Repositories\All\OfferMilestoneAttachment\OfferMilestoneAttachmentInterface;
use App\Repositories\All\Project\ProjectInterface;
use App\Repositories\All\ProjectAttachment\ProjectAttachmentInterface;
use Illuminate\Support\Facades\Notification;

class ProjectController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected OfferInterface $offerInterface,
        protected ProjectInterface $projectInterface,
        protected ProjectAttachmentInterface $projectAttachmentInterface,
        protected OfferMilestoneInterface $offerMilestoneInterface,
        protected OfferMilestoneAttachmentInterface $offerMilestoneAttachmentInterface,
    ) {}

    public function submitProject(string $id, ProjectRequest $request)
    {

        // dd($request->all());
        if ($request->attachment != null) {

            $file = $request->attachment;
            if ($file) {
                $path = $file->store('project', 'public');
                $this->projectAttachmentInterface->updateOrCreate(
                    ['project_id' => $id],
                    [
                        'project_id' => $id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]
                );
            }
        }

        $project = $this->projectInterface->findById($id, ['*'], ['freelancer', 'client']);
        $project->status = 'uploaded';
        $project->save();

        try {
            $data = 'Project Upload Successfully';
            Notification::send($project->freelancer, new PublicNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }
        try {
            $data1 = 'Project Submitted by '.$project->freelancer->first_name;
            Notification::send($project->client, new PublicNotification($data1));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('freelancer.contract.show', $project->offer_id)->with('success', ['Project Uploaded Successfully', $this->randomKey()]);

    }

    public function submitProjectMilestone(int $id, ProjectRequest $request)
    {
        if ($request->attachment != null) {
            $file = $request->attachment;
            if ($file) {
                $path = $file->store('milestoneProject', 'public');
                $this->offerMilestoneAttachmentInterface->updateOrCreate(
                    ['offer_milestone_id' => $id],
                    [
                        'offer_milestone_id' => $id,
                        'type' => $file->getClientMimeType(),
                        'file_name' => $file->getClientOriginalName(),
                        'path' => $path,
                        'status' => 'active',
                        'size' => $file->getSize(),
                    ]
                );

            }
        }
        $milestone = $this->offerMilestoneInterface->findById($id['*'], ['freelancer', 'client']);
        $milestone->project_status = 'uploaded';
        $milestone->save();
        try {
            $data = 'ProMilestone Project Upload Successfully';
            Notification::send($milestone->freelancer, new PublicNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }
        try {
            $data1 = 'Milestone Project Submitted by '.$milestone->freelancer->first_name;
            Notification::send($milestone->client, new PublicNotification($data1));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->route('freelancer.contract.show', $milestone->offer_id)->with('success', ['Milestone Uploaded Successfully', $this->randomKey()]);

    }
}
