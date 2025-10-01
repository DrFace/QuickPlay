<?php

namespace App\Http\Controllers\Admin;

use App\Enums\VerificationStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\IdentityVerificationResource;
use App\Http\Traits\UtilityTrait;
use App\Models\IdentityVerification;
use App\Notifications\IdentityVerification\IdentityVerificationCompleted;
use App\Notifications\IdentityVerification\IdentityVerificationRejected;
use App\Repositories\All\IdentityVerification\IdentityVerificationInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class IdentityVerificationController extends Controller
{
    use UtilityTrait;

    protected $IdentityVerificationInterface;

    public function __construct(IdentityVerificationInterface $IdentityVerificationInterface)
    {
        $this->IdentityVerificationInterface = $IdentityVerificationInterface;
    }

    public function index(Request $request)
    {

        $filters = $request->only('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'user_id';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/IdentityVerification/All/Index', [
            // 'user' => Auth::user(),
            'filters' => $filters,
            'identityVerifications' => IdentityVerificationResource::collection($this->IdentityVerificationInterface->filterWithParam($filters)),
        ]);
    }

    public function show($id)
    {
        $identityVerification = $this->IdentityVerificationInterface->findByColumn(['id' => $id], ['*'], ['user']);

        return Inertia::render('Admin/IdentityVerification/Show/Index', [
            'identityVerification' => $identityVerification,
            // 'auth' => Auth::user(),
            'identityVerificationStatus' => $this->enumToSelect(VerificationStatusEnum::cases()),

        ]);
    }

    public function update(Request $request, int $id)
    {
        $validated = $request->validate([
            'status' => 'required|string',
            'reason' => 'nullable|string', // Make reason nullable

        ]);
        $identityVerification = $this->IdentityVerificationInterface->findById($id);
        if ($identityVerification) {
            if ($validated['status'] === 'rejected') {
                $identityVerification->status = 'start';
                $identityVerification->reject_reason = $validated['reason'];
                $identityVerification->save();

                try {
                    Notification::send($identityVerification->user, new IdentityVerificationRejected($identityVerification->user->first_name, $validated['reason'] ?? 'No specific reason provided.'));
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to send verification email: '.$e->getMessage());
                }

                return redirect()->route('admin.identity-verifications.index')->with('success', ['Identity Verification Rejected Successfully!', $this->randomKey()]);
            }
            if ($validated['status'] === 'verified') {
                $identityVerification->status = 'verified';
                $identityVerification->save();

                try {
                    Notification::send($identityVerification->user, new IdentityVerificationCompleted($identityVerification->user->first_name));
                } catch (\Exception $e) {
                    return redirect()->back()->with('error', 'Failed to send verification email: '.$e->getMessage());
                }

                return redirect()->route('admin.identity-verifications.index')
                    ->with('success', ['Identity Verification Completed Successfully !', $this->randomKey()]);
            }

            $identityVerification->status = $validated['status'];
            $identityVerification->save();

            return redirect()->route('admin.identity-verifications.index')->with('success', ['Status Updated Successfully!', $this->randomKey()]);
        } else {
            return redirect()->back()->with('error', 'Identity verification not found.');
        }
    }

    public function destroy(IdentityVerification $identityVerification)
    {
        $this->IdentityVerificationInterface->deleteById($identityVerification->id);

        return redirect(route('admin.identity-verifications.index'))->with('success', 'Identity Verification Deleted Successfully');
    }
}
