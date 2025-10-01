<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\IdentityVerification\IdentityVerificationInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class IdentityVerificationController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected IdentityVerificationInterface $identityVerificationInterface
    ) {}

    public function store(Request $request)
    {
        $request->validate([
            'selfie' => 'required|string',
        ]);

        $selfieData = $request->input('selfie');
        $fileName = uniqid().'.png';
        $filePath = "public/selfies/$fileName";

        $image = preg_replace('/^data:image\/\w+;base64,/', '', $selfieData);
        $image = str_replace(' ', '+', $image);

        if (Storage::put($filePath, base64_decode($image))) {

            $userId = Auth::id();

            $verification = $this->identityVerificationInterface->updateOrCreate(
                ['user_id' => $userId],
                [
                    'selfie_image' => $filePath,
                    'status' => 'step_one_done',
                    'reject_reason' => null,

                ]
            );

            return redirect()->back()->with('success', 'Selfie Image Saved Successfully');
        } else {
            return redirect()->back()->with('error', ['Failed to save selfie image to storage', $this->randomKey()]);
        }
    }

    public function IDCardImageStore(Request $request)
    {

        $request->validate([
            'idImage' => 'required|image|mimes:jpg,jpeg,png|max:102400',
        ]);

        $idImageFile = $request->file('idImage');
        $filePath = $idImageFile->store('id_cards', 'public');

        if ($filePath) {

            $userId = Auth::id();
            $verification = $this->identityVerificationInterface->updateOrCreate(
                ['user_id' => $userId],
                [
                    'id_card_image' => $filePath,
                    'status' => 'step_two_done',
                    'reject_reason' => null,
                ]
            );

            return redirect()->back()->with('success', 'ID Card Image Saved Successfully');
        } else {
            return redirect()->back()->with('error', ['Failed to save ID card image to storage', $this->randomKey()]);
        }
    }
}
