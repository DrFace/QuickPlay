<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\ConnectPackage\ConnectPackageInterface;
use App\Repositories\All\Credit\CreditInterface;
use App\Repositories\All\Payment\PaymentInterface;
use App\Repositories\All\User\UserInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected UserInterface $userInterface,
        protected CreditInterface $creditInterface,
        protected ConnectPackageInterface $ConnectPackageInterface,
        protected PaymentInterface $paymentInterface,

    ) {}

    public function createPaymentIntent(string $id)
    {

        $price = $this->ConnectPackageInterface->findByUuId($id)->amount;
        $intent = auth()->user()->createSetupIntent();

        return Inertia::render('Freelancer/Payment/Index', [
            'clientSecret' => $intent->client_secret,
            'price' => $price,
            'connectPackageId' => $id,
            'user' => $this->userInterface->findByUuId(Auth::id()),
        ]);
    }

    public function processPayment(Request $request)
    {
        try {
            $paymentMethod = $request->payment_method;
            $price = $request->price;
            $user = auth()->user();
            $user->createOrGetStripeCustomer();
            $user->addPaymentMethod($paymentMethod);

            $paymentIntent = $user->charge(
                $price * 100,
                $paymentMethod,
                [
                    'return_url' => route('freelancer.account'),
                ]
            );

            if ($paymentIntent->status == 'succeeded') {

                $ConnectPackage = $this->ConnectPackageInterface->findByUuId($request->connectPackageId);
                $credit = $this->creditInterface->updateOrCreate(
                    ['user_id' => $user->id, 'status' => 'draft'],
                    [
                        'amount' => $price,
                        'connects' => $ConnectPackage->connects,
                        'available_connects' => $ConnectPackage->connects,
                        'expire_date' => now()->addYear(),
                        'tax' => 0,
                    ]
                );

                // Log::info('Payment successful', ['user_id' => $user->id, 'credit_id' => $credit->id , $paymentIntent]);
                $payment = $this->paymentInterface->create([
                    'user_id' => $user->id,
                    'type' => 'credit',
                    'amount' => $price,
                    'currency' => 'usd',
                    'status' => 'pending',
                    'payment_for' => 'connect_package',
                    'credit_id' => $credit->id,
                    'stripe_customer_id' => $paymentIntent->customer,
                    'stripe_charge_id' => $paymentIntent->latest_charge,
                    'stripe_payment_method_id' => $paymentIntent->payment_method,
                    'stripe_payment_intent_id' => $paymentIntent->id,
                    'description' => $ConnectPackage->label.' package payment',
                ]);

                return redirect()->route('freelancer.account')->with('success', ['Payment Successful', $this->randomKey()]);
            } else {
                return redirect()->route('freelancer.account')->with('error', ['Payment failed', $this->randomKey()]);
            }
        } catch (\Exception $exception) {
            return redirect()->route('freelancer.account')->with('error', ['Payment failed', $this->randomKey()]);
        }
    }

    public function getClientSecret(Request $request)
    {
        $intent = auth()->user()->createSetupIntent();

        return response()->json(['client_secret' => $intent->client_secret]);
    }
}
