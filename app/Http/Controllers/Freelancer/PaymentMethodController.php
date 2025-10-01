<?php

namespace App\Http\Controllers\Freelancer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Account\StorePaymentMethodRequest;
use App\Http\Traits\UtilityTrait;
use App\Notifications\AppNotification\CreateNotification;
use App\Notifications\AppNotification\DeleteNotification;
use App\Repositories\All\PaymentMethod\PaymentMethodInterface;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;

class PaymentMethodController extends Controller
{
    public function __construct(
        protected PaymentMethodInterface $paymentMethodInterface,
    ) {}

    use UtilityTrait;

    public function storeBankMethod(StorePaymentMethodRequest $request)
    {
        $validatedData = $request->validated();

        $userId = Auth::id();
        $user = Auth::user();

        if (! $userId) {
            return response()->json(['message' => 'User not authenticated'], 401);
        }

        $existingMethod = $this->paymentMethodInterface->findByColumn([
            'user_id' => $userId,
            'account_holder_name' => $validatedData['accountHolderName'],
            'account_number' => $validatedData['accountNumber'],
            'iban_number' => $validatedData['ibanNumber'],
            'country' => $validatedData['country'],
            'bank_name' => $validatedData['bankName'],
            'bank_address' => $validatedData['bankAddress'],
        ]);

        if ($existingMethod) {
            return redirect()->route('freelancer.account')
                ->with('unsuccess', 'This Payment Method Already Exists.');
        }

        try {
            $this->paymentMethodInterface->create([
                'user_id' => $userId,
                'account_holder_name' => $validatedData['accountHolderName'],
                'account_number' => $validatedData['accountNumber'],
                'iban_number' => $validatedData['ibanNumber'],
                'country' => $validatedData['country'],
                'bank_name' => $validatedData['bankName'],
                'bank_address' => $validatedData['bankAddress'],
            ]);
            $data = 'Payment method';
            try {
                Notification::send($user, new CreateNotification($data));
            } catch (\Exception $e) {
                return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
            }

            return redirect()->route('freelancer.account')
                ->with('success', 'Payment Method Saved Successfully.');

        } catch (\Exception $e) {
            return response()->json(['message' => 'Failed to save payment method: '.$e->getMessage()], 500);
        }

    }

    public function deleteBankMethod(int $id)
    {
        $paymentMethod = $this->paymentMethodInterface->findByColumn(['id' => $id]);
        $data = 'Payment method';
        $user = $paymentMethod->user;

        if (! $paymentMethod) {
            return redirect()->back()->withErrors(['message' => 'Payment Method Not Found.']);
        }

        $paymentMethod->delete();
        try {
            Notification::send($user, new DeleteNotification($data));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect()->back()->with('success', 'Payment Method Deleted Successfully.');
    }
}
