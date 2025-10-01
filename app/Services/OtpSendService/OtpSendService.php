<?php

namespace App\Services\OtpSendService;

use App\Notifications\SendEmailChangeConfirmation;
use App\Notifications\SendPasswordChangeConfirmation;
use App\Notifications\SendTwoFactorConfirmation;
use App\Notifications\Welcome\WelcomeNotification;
use App\Repositories\All\User\UserInterface;
use Illuminate\Support\Facades\Auth;

class OtpSendService
{
    public function __construct(
        protected UserInterface $userInterface,
    ) {}

    public function otpGenerate()
    {
        $user = $this->userInterface->findByUuId(Auth::id());
        $otp = mt_rand(100000, 999999);
        $user->otp = $otp;
        $user->save();

        return $otp;
    }

    public function sendOtp(string $type)
    {

        $user = $this->userInterface->findByUuId(Auth::id());
        $email = $user->email;
        $first_name = $user->first_name;
        $otp = $this->otpGenerate();

        if ($type === 'two_factor_enable') {
            $user->notify(new SendTwoFactorConfirmation($otp, $first_name));
        } elseif ($type === 'password_change') {
            $user->notify(new SendPasswordChangeConfirmation($otp, $email));
        } elseif ($type === 'email_change') {
            $user->notify(new SendEmailChangeConfirmation($otp, $email));
        } elseif ($type === 'welcome') {
            $user->notify(new WelcomeNotification($otp, $email));
        }

    }

    public function verifyOtp(string $otp)
    {
        $user = $this->userInterface->findByUuId(Auth::id());
        if ($otp === $user->otp) {
            return true;
        }

        return false;
    }

    public function clearOtp()
    {
        $user = $this->userInterface->findByUuId(Auth::id());
        $user->otp = null;
        $user->save();
    }
}
