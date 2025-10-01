<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Providers\RouteServiceProvider;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TwoFactorChallengeController extends Controller
{
    public function __construct(
        protected UserInterface $userInterface,
    ) {}

    public function show(Request $request)
    {
        return Inertia::render('Auth/TwoFactorChallenge', [
            'email' => session('email'),
        ]);
    }

    public function verify(Request $request)
    {

        $request->validate(
            [
                'code' => 'required',
                'email' => 'required|email|exists:users,email',
            ]
        );

        $user = $this->userInterface->findByColumn(['email' => $request->email]);
        if ($user && $request->code === $user->otp) {
            Auth::login($user);
            $role = $user->user_type;
            if ($role === 'client') {
                return redirect()->intended(RouteServiceProvider::CLIENT)->with('success', 'Welcome Back!');
            } elseif ($role === 'freelancer') {
                return redirect()->intended(RouteServiceProvider::FREELANCER)->with('success', 'Welcome Back!');
            } elseif ($role === 'admin') {
                return redirect()->intended(RouteServiceProvider::ADMIN)->with('success', 'Welcome Back!');
            }
        }

        return back()->withErrors(['code' => 'The provided code is incorrect.']);
    }
}
