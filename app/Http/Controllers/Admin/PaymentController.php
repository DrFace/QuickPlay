<?php

namespace App\Http\Controllers\Admin;

use App\Enums\AdminStatusEnum;
use App\Enums\PaymentStatusEnum;
use App\Http\Controllers\Controller;
use App\Http\Resources\PaymentResource;
use App\Http\Traits\UtilityTrait;
use App\Notifications\PaymentApprovedNotification\PayoutApprovedNotification;
use App\Repositories\All\Payment\PaymentInterface;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Notification;
use Inertia\Inertia;

class PaymentController extends Controller
{
    use UtilityTrait;

    public function __construct(protected PaymentInterface $paymentInterface) {}

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $filters = $request->all('searchParam', 'sortBy', 'sortDirection', 'rowPerPage', 'page', 'range1', 'range2', 'status');
        $filters['sortBy'] = $filters['sortBy'] ?? 'id';
        $filters['sortDirection'] = $filters['sortDirection'] ?? 'asc';
        $filters['rowPerPage'] = $filters['rowPerPage'] ?? 10;
        $filters['range1'] = $filters['range1'] ?? Carbon::now()->subYear()->format('Y-m-d');
        $filters['range2'] = $filters['range2'] ?? Carbon::now()->format('Y-m-d');
        $filters['status'] = $request->status ?? 'All';

        return Inertia::render('Admin/Payments/All/Index', [
            'filters' => $filters,
            'payments' => PaymentResource::collection($this->paymentInterface->filter($filters)),
            'paymentStatus' => $this->enumToSelect(PaymentStatusEnum::cases()),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $payment = $this->paymentInterface->findByUuId($id, ['*'], ['user', 'offer']);

        return Inertia::render('Admin/Payments/Edit/Index', [
            'payment' => $payment,
            'type' => 'edit',
            'paymentStatus' => $this->enumToSelect(PaymentStatusEnum::cases()),
            'adminStatus' => $this->enumToSelect(AdminStatusEnum::cases()),
        ]);
    }

    /**
     * updatePayment
     *
     * @param  mixed  $request
     * @param  mixed  $category
     * @return void
     */
    public function updatePayment(Request $request, string $id)
    {
        // dd($request->all());
        $data = $request->all();
        $payment = $this->paymentInterface->findByUuId($id);
        $payment->update([
            'status' => $data['status'],
            'admin_status' => $data['admin_status'],
        ]
        );

        $first_name = $payment->user->first_name;
        try {
            Notification::send($payment->user, new PayoutApprovedNotification($first_name));
        } catch (\Exception $e) {
            return redirect()->back()->withErrors(['error' => 'Failed to send notification. Please try again later.']);
        }

        return redirect(route('admin.payments.index'))->with('success', ['Payment Updated Successfully', $this->randomKey()]);
    }
}
