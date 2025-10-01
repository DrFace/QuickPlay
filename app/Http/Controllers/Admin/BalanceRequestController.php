<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\BalanceRequestResource;
use App\Http\Traits\UtilityTrait;
use App\Notifications\PaymentApprovedNotification\PaymentApprovedNotification;
use App\Repositories\All\BalanceRequest\BalanceRequestInterface;
use App\Repositories\All\Payment\PaymentInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class BalanceRequestController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected PaymentInterface $paymentInterface,
        protected BalanceRequestInterface $balanceRequestInterface,
    ) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2');
        $filters['sortBy'] = $filters['sortBy'] ?? 'id';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');

        return Inertia::render('Admin/BalanceRequests/All/Index', [
            'filters' => $filters,
            'balanceRequest' => BalanceRequestResource::collection($this->balanceRequestInterface->filter($filters)),
            'paymentStatus' => $this->enumToSelect(PaymentStatusEnum::cases()),
        ]);
    }

    /*/**
     * Undocumented function
     *
     * @return void
     */

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $balanceRequest = $this->balanceRequestInterface->findByUuId($id, ['*'], ['user', 'paymentMethod']);

        return Inertia::render('Admin/BalanceRequests/Edit/Index', [
            'balanceRequest' => $balanceRequest,
            'type' => 'edit',
            'requestStatus' => $this->enumToSelect(AdminStatusEnum::cases()),
        ]);
    }

    /**
     * updateBalance
     *
     * @param  mixed  $request
     * @param  mixed  $category
     * @return void
     */
    public function updateBalanceRequest(Request $request, int $id)
    {
        // dd($request->all());
        $data = $request->all();
        $balanceRequest = $this->balanceRequestInterface->findById($id);
        $balanceRequest->update(
            [
                'status' => $data['status'],
            ]
        );

        $this->paymentInterface->create([
            'user_id' => Auth::id(),
            'type' => 'debit',
            'amount' => $balanceRequest->received_amount,
            'currency' => 'usd',
            'status' => 'succeeded',
            'payment_for' => 'balance_payment',
            'balance_request_id' => $balanceRequest->id,
            'description' => 'Balance payment',
            'freelancer_id' => $balanceRequest->user_id,
        ]);

        $first_name = $balanceRequest->user->first_name;

        try {
            Notification::send($balanceRequest->user, new PaymentApprovedNotification($first_name));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect(route('admin.payments.index'))->with('success', ['Payment Updated Successfully', $this->randomKey()]);
    }
}
