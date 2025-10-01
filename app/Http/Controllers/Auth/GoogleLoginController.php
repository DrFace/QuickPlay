<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Notifications\SendTwoFactorConfirmation;
use App\Notifications\Welcome\WelcomeNotificationWithPassword;
use App\Providers\RouteServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Notification;
use Laravel\Socialite\Facades\Socialite;

class GoogleLoginController extends Controller
{
    public function redirectToGoogleFromRegister(Request $request)
    {
        // $request->session()->put('user_type',  $request->role);
        // return Socialite::driver('google')->redirect();
        $request->validate([
            'role' => 'required|string|in:client,freelancer',
            'country' => 'required|string|max:255',
            'time_zone' => 'required|string|max:255',
        ]);

        $state = json_encode(['user_type' => $request->role, 'country' => $request->country, 'time_zone' => $request->time_zone]);

        return Socialite::driver('google')->with(['state' => $state])->redirect();
    }

    public function redirectToGoogleFromLogin()
    {
        if (Auth::check()) {
            return redirect(RouteServiceProvider::HOME);
        }

        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback(Request $request)
    {

        try {
            $googleUser = Socialite::driver('google')->user();
        } catch (\Exception $e) {
            $googleUser = Socialite::driver('google')->stateless()->user();
        }

        $user = User::withTrashed()->where('email', $googleUser->email)->first();

        if ($user && $user->trashed()) {
            return redirect()->route('login')->with('error', 'Your account has been deactivated. Please contact support for more information.');
        }

        $userType = null;
        $state = $request->input('state');

        if ($state) {
            $stateData = json_decode($state, true);
            $userType = $stateData['user_type'] ?? null;
            $country = $stateData['country'] ?? null;
            $timeZone = $stateData['time_zone'] ?? null;
        }

        if ($user) {
            $userType = $user->user_type;
        }

        if ($userType) {

            if (! $user) {
                $nameParts = explode(' ', $googleUser->name, 2);
                $firstName = $nameParts[0];
                $lastName = isset($nameParts[1]) ? $nameParts[1] : '';
                $lowercase = str_shuffle('abcdefghijklmnopqrstuvwxyz');
                $uppercase = str_shuffle('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                $numbers = str_shuffle('0123456789');
                $specialCharacters = str_shuffle('@$!%*?&');
                $combined = $lowercase[0].$uppercase[0].$numbers[0].$specialCharacters[0];
                $remainingLength = 8;
                $allCharacters = str_shuffle($lowercase.$uppercase.$numbers.$specialCharacters);
                $temporaryPassword = str_shuffle(substr($combined.$allCharacters, 0, $remainingLength));
                $user = User::create([
                    'first_name' => $firstName,
                    'last_name' => $lastName,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                    'user_type' => $userType,
                    'country' => $country,
                    'time_zone' => $timeZone,
                    'profile_complete_score' => 6,
                    'password' => Hash::make($temporaryPassword),
                ]);

                $user->markEmailAsVerified();
            } elseif ($user->google_id == null) {
                $user->update([
                    'google_id' => $googleUser->id,
                    'google_token' => $googleUser->token,
                ]);
            } else {
                $user->update([
                    'google_token' => $googleUser->token,
                ]);
            }
            if ($user->two_factor_authentication) {
                $otp = random_int(100000, 999999);
                $user->otp = $otp;
                $user->save();
                Notification::route('mail', $user->email)->notify(new SendTwoFactorConfirmation($otp, $user->first_name));

                return redirect()->route('two-factor.challenge')->with('email', $user->email);
            } else {
                Auth::login($user);
            }

            try {
                Notification::send($user, new WelcomeNotificationWithPassword($temporaryPassword, $user->first_name));
            } catch (\Exception $e) {
            }
            if ($user->user_type === 'client') {
                return redirect()->intended(RouteServiceProvider::CLIENT)->with('success', 'Welcome Back!');
            } elseif ($user->user_type === 'freelancer') {
                return redirect()->intended(RouteServiceProvider::FREELANCER)->with('success', 'Welcome Back!');
            }
        }

        return redirect()->intended(RouteServiceProvider::REGISTER)->with('Error', 'Register first!');
    }
}
