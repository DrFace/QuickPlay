<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\UpdatePasswordRequest;
use App\Http\Requests\ClientSettings\PasswordChangeOtpRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\SendPasswordChangeConfirmation;
use App\Repositories\All\IdentityVerification\IdentityVerificationInterface;
use App\Repositories\All\User\UserInterface;
use App\Services\CountryService\CountryService;
use App\Services\TimeZoneService\TimeZoneService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class SettingsController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected IdentityVerificationInterface $identityVerificationInterface,
        protected CountryService $CountryService,
        protected TimeZoneService $TimeZoneService,

    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $identityVerification = $this->identityVerificationInterface->findByColumn(['user_id' => Auth::id()]);
        if (! $identityVerification) {
            $status = 'start';
        } else {
            $status = $identityVerification->status;
        }
        // dd( $identityVerification->reject_reason);

        return Inertia::render('Client/Setting/All/Index', [

            'user' => Auth::user(),
            'status' => $status,
            'rejectReason' => $identityVerification->reject_reason ?? null,
            'selectedTab' => 'My Info',
            'countryMap' => $this->CountryService->getCountries(),
            'timeZoneOptions' => $this->TimeZoneService->getTimeZones(),

        ]);
    }

    public function updatePasswordInfo(UpdatePasswordRequest $request)
    {
        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        if ($request->input('current_password')) {
            if (! Hash::check($request->input('current_password'), $user->password)) {
                return back()->withErrors(['current_password' => 'Your current password is incorrect.']);
            }
        }
        $data = $request->validated();
        $user['password'] = Hash::make($data['new_password']);
        $user->save();

        return back()->with('success', ['Password Updated Successfully.', $this->randomKey()]);
    }

    public function sendPasswordChangeOtp(PasswordChangeOtpRequest $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);
        $email = $user->email;
        $otp = random_int(100000, 999999);
        $user->otp = $otp;
        $user->save();

        try {
            Notification::route('mail', $email)->notify(new SendPasswordChangeConfirmation($otp, $email));

            return redirect()->back()->with('success', ['OTP has been Sent to Your Email.', $this->randomKey()]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['email' => ['Failed to send OTP. Please try again later.', $this->randomKey()]]);
        }
    }
}
