<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\ConnectPackage\ConnectPackageInterface;
use App\Repositories\All\Credit\CreditInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CreditsController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected CreditInterface $creditInterface,
        protected ConnectPackageInterface $ConnectPackageInterface
    ) {}

    public function index(Request $request)
    {
        $userId = Auth::id();
        $credits = $this->creditInterface->getByColumn(['user_id' => $userId, 'status' => 'active']);
        $connectPackages = $this->ConnectPackageInterface->getByColumn(['status' => 'active'], ['id as id', 'connects as value', 'label as label', 'amount as amount']);

        return Inertia::render('Freelancer/Credit/All/Index', [
            'user' => Auth::user(),
            'credits' => $credits,
            'connectPackages' => $connectPackages,
        ]);
    }

    public function paymentSuccess()
    {
        return Inertia::render('Freelancer/Credit/All/Success', [
            'message' => 'Your Payment was Successful. Your Connects will be Added to Your Account Shortly.',
        ]);
    }

    public function paymentCancel()
    {
        return Inertia::render('Freelancer/Credit/All/Cancel', [
            'message' => 'Your Payment was Cancelled. Please Try Again.',
        ]);
    }
}
