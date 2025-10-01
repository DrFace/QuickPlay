<?php

namespace App\Http\Controllers;

use App\Http\Requests\Account\UpdatePasswordRequest;
use App\Http\Requests\Account\UpdateTwoFactorRequest;
use App\Http\Requests\Location\LocationInfoUpdateRequest;
use App\Http\Requests\Profile\NameUpdateRequest;
use App\Http\Requests\Profile\NewMailUpdateRequest;
use App\Http\Requests\Profile\ProfileImageRequest;
use App\Http\Requests\Profile\SendOtpRequest;
use App\Http\Requests\ProfileUpdateRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\UpdateNotification;
use App\Notifications\SendEmailChangeConfirmation;
use App\Notifications\SendOtpNotification;
use App\Repositories\All\Education\EducationInterface;
use App\Repositories\All\EmployHistory\EmployHistoryInterface;
use App\Repositories\All\Language\LanguageInterface;
use App\Repositories\All\PaymentMethod\PaymentMethodInterface;
use App\Repositories\All\Portfolio\PortfolioInterface;
use App\Repositories\All\User\UserInterface;
use App\Repositories\All\UserJobCategory\UserJobCategoryInterface;
use App\Services\GlobalDataServices\GlobalDataService;
use App\Services\OtpSendService\OtpSendService;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected OtpSendService $otpSendService,
        protected UserJobCategoryInterface $userJobCategoryInterface,
        protected EducationInterface $educationInterface,
        protected LanguageInterface $languageInterface,
        protected EmployHistoryInterface $employHistoryInterface,
        protected PortfolioInterface $portfolioInterface,
        protected PaymentMethodInterface $paymentMethodInterface,
    ) {}

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }
        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);
        $user = $request->user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    /*
     * live status update.
     */
    public function updateLiveStatus()
    {
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->active_status = ! $user->active_status;
        $user->save();

        return redirect()->back()->with('success', ['Your Live Status Updated Successfully.', $this->randomKey()]);
    }

    /*
    * update location .
    */
    public function updateLocation(LocationInfoUpdateRequest $request)
    {
        $data = $request->only(['country', 'time_zone']);
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->update($data);
        $metaData = $request->except(['country', 'time_zone']);
        $user->setMeta($metaData);
        $user->update($metaData);

        return redirect()->back()->with('success', ['Location Information Updated Successfully.', $this->randomKey()]);
    }

    /*
    * update profile image.
    */
    public function updateProfileImage(ProfileImageRequest $request)
    {
        $data = $request->all();
        $user = $this->userInterface->findByUuId(Auth::id());
        if ($request->hasFile('image')) {
            $path = $data['image']->store('profile', 'public');
            $data['image'] = $path;
            $user->update($data);
        } else {
            $user->update(['image' => null]);
        }
        $data = 'Profile Image';
        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', ['Profile Image Updated Successfully',  $this->randomKey()]);
    }

    /*
    * update name.
    */

    public function updateName(NameUpdateRequest $request)
    {
        $data = $request->all();
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->update($data);
        $data = 'Name';
        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', ['Name Updated Successfully',  $this->randomKey()]);
    }

    /*
    * send otp.
    */

    public function sendOtp(SendOtpRequest $request)
    {
        $user = $this->userInterface->findByUuId(Auth::id());
        $newEmail = $request->input('new_email');
        $otp = random_int(100000, 999999);
        $user->otp = $otp;
        $user->save();

        try {
            Notification::route('mail', $newEmail)->notify(new SendOtpNotification($otp, $newEmail));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['new_email' => 'Failed to send OTP. Please try again later.']);
        }
    }

    /*
    * update email.
    */
    public function updateEmail(NewMailUpdateRequest $request)
    {
        $user = $this->userInterface->findByUuId(Auth::id());

        if ($user->otp !== $request->otp) {
            return redirect()->back()->withErrors(['otp' => 'Invalid OTP.']);
        }

        $newEmail = $request->new_email;
        $user->email = $newEmail;
        $user->otp = null;
        $user->save();

        try {
            Notification::send($user, new SendEmailChangeConfirmation($newEmail));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['new_email' => 'Failed to send email change confirmation. Please try again later.']);
        }

        return redirect()->back()->with('success', ['Your Email Updated Successfully.', $this->randomKey()]);
    }

    public function updatePasswordInfo(UpdatePasswordRequest $request)
    {
        // dd( $request->all());
        $user = $this->userInterface->findByUuId(Auth::id());
        if ($request->input('current_password')) {
            if (! Hash::check($request->input('current_password'), $user->password)) {
                return back()->withErrors(['current_password' => 'Your current password is incorrect.']);
            }
        }
        $data = $request->validated();
        $user['password'] = Hash::make($data['new_password']);
        $user->save();

        $data = 'Password';

        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return back()->with('success', ['Password Updated Successfully.', $this->randomKey()]);
    }

    public function updateTwoFactorInfo(UpdateTwoFactorRequest $request)
    {
        $validated = $request->validate([
            'otp' => 'required|digits:6',
        ]);

        $user = $this->userInterface->findByColumn(['id' => Auth::id()]);

        if ($user->otp !== $request->input('otp')) {
            return redirect()->back()->withErrors(['otp' => 'Invalid OTP code.']);
        }

        $user->two_factor_authentication = ! $user->two_factor_authentication;

        $user->otp = null;
        $user->save();
        $data = 'Two-Factor Authentication';

        try {
            Notification::send($user, new UpdateNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('status', 'Two-Factor Authentication Settings have been Updated Successfully.');
    }

    public function sendOtpCode(string $type)
    {
        try {
            $this->otpSendService->sendOtp($type);

            return redirect()->back()->with('success', ['OTP has been Sent to Your Email.', $this->randomKey()]);
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['email' => 'Failed to Send OTP. Please Try Again Later.']);
        }
    }

    public function profileComplete()
    {
        $user = $this->userInterface->findByUuId(Auth::id());

        if (
            $user->first_name == null ||
            $user->last_name == null ||
            $user->email == null ||
            $user->country == null ||
            $user->time_zone == null ||
            $user->password == null
        ) {
            // Redirect to the account settings page with the "profile" tab preselected
            return redirect()->route('freelancer.account', ['subTab' => 'Contact%20Info'])
                ->with('error', 'Please complete your profile first.');
        } elseif (
            $user->getMeta('title') == null
        ) {
            return redirect()->route('freelancer.profile')->with('error', 'Please update your title here.');
        } elseif (
            $user->getMeta('profile_overview') == null
        ) {
            return redirect()->route('freelancer.profile')->with('error', 'Please update your profile overview here.');
        } elseif (
            $user->getMeta('skills') == null
        ) {
            return redirect()->route('freelancer.profile')->with('error', 'Please update your skills here.');
        }
        if (
            $user->getMeta('address_line1') == null ||
            $user->getMeta('phone') == null
        ) {
            // Redirect to the account settings page with the "profile" tab preselected
            return redirect()->route('freelancer.account', ['subTab' => 'Contact%20Info'])
                ->with('error', 'Please complete your contact info here.');
        } elseif (
            $user->getMeta('visibility') == null ||
            $user->getMeta('project_preference') == null ||
            $user->getMeta('experience_level') == null
        ) {
            return redirect()->route('freelancer.account', ['subTab' => 'Profile%20Settings'])
                ->with('error', 'Please complete My Profile & Experience Levels section.');
        } elseif ($this->portfolioInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.profile')->with('error', 'Please add your portfolio here.');
        } elseif ($this->educationInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.profile')
                ->with('error', 'Please add your education here.');
        } elseif ($this->employHistoryInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.profile')
                ->with('error', 'Please add your employment history here.');
        } elseif ($this->userJobCategoryInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.account', ['subTab' => 'Profile%20Settings'])
                ->with('error', 'Please add your job categories here.');
        } elseif ($this->languageInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.profile', ['subTab' => 'Languages'])
                ->with('error', 'Please add your languages here.');
        } elseif ($this->paymentMethodInterface->getByColumn(['user_id' => $user->id])->count() == 0) {
            return redirect()->route('freelancer.account', ['subTab' => 'Get%20Paid'])
                ->with('error', 'Please add your payment methods here.');
        } elseif (
            $user->getMeta('video_link') == null
        ) {
            return redirect()->route('freelancer.profile')->with('error', 'Please update your video intro here.');
        } elseif ($user->image == null) {
            return redirect()->route('freelancer.profile')->with('error', 'Please update your profile image here.');
        } else {
            $user->profile_complete_score = 100;
            $user->save();

            return redirect()->route('freelancer.dashboard')->with('success', 'Profile Completed Successfully.');
        }
    }

    public function deleteFunction(Request $request)
    {
        $notificationId = $request->id;
        $globalDataService = app()->make(GlobalDataService::class);
        $globalDataService->deleteNotification($notificationId);

        return redirect()->back()->with('success', ['Notification Deleted Successfully.', $this->randomKey()]);
    }

    //    mark all as read
    public function markAllAsRead()
    {
        $user = auth()->user();
        $user->unreadNotifications->markAsRead();

        return redirect()->back()->with('success', ['All Notifications Marked as Read.', $this->randomKey()]);
    }
}
