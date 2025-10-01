<?php

namespace App\Http\Controllers\Freelancer;

use App\Exports\PaymentsExport;
use App\Http\Controllers\Controller;
use App\Http\Traits\UtilityTrait;
use App\Repositories\All\BalanceRequest\BalanceRequestInterface;
use App\Repositories\All\BalanceRequestPayment\BalanceRequestPaymentInterface;
use App\Repositories\All\Payment\PaymentInterface;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Facades\Excel;

class PaymentRequestController extends Controller
{
    use UtilityTrait;

    public function __construct(
        protected PaymentInterface $paymentInterface,
        protected BalanceRequestInterface $balanceRequestInterface,
        protected BalanceRequestPaymentInterface $balanceRequestPaymentInterface,

    ) {}

    public function requestAvailablePayment(Request $request)
    {
        // dd($request->all());
        $paymentIds = $request->selected_array;
        $bankId = $request->selected_bank;

        $balanceRequest = $this->balanceRequestInterface->create([
            'user_id' => Auth::id(),
            'payment_method_id' => $bankId,
        ]);

        $amount = 0;
        $payment = [];
        foreach ($paymentIds as $paymentId) {
            $payment = $this->paymentInterface->findByUuId($paymentId);
            $payment->payment_status = 'requested';
            $payment->save();
            $amount += $payment->amount;

            $this->balanceRequestPaymentInterface->create([
                'balance_request_id' => $balanceRequest->id,
                'payment_id' => $payment->id,
            ]);
        }

        $balanceRequest->update([
            'amount' => $amount,
            'received_amount' => $amount - ($amount * 0.1),
        ]);

        return redirect()->route('freelancer.financial.overview')->with('success', 'Payment Request has been Sent Successfully');
    }

    public function export()
    {
        $filename = 'Balance-Sheet.csv';

        return Excel::download(new PaymentsExport, $filename);
    }

    public function maskAccountNumber($accountNumber)
    {
        $masked = substr($accountNumber, 0, 2).str_repeat('*', strlen($accountNumber) - 4).substr($accountNumber, -2);

        return $masked;
    }

    public function InvoiceDownload(int $id)
    {
        $balanceRequest = $this->balanceRequestInterface->findById($id, ['*'], ['user', 'paymentMethod']);
        $paymentIds = $this->balanceRequestPaymentInterface->getByColumn(['balance_request_id' => $id], ['*'], ['payment']);

        // dd($paymentIds  , $balanceRequest);
        $data = [
            'payment_date' => $balanceRequest->created_at_human,
            'bank' => $balanceRequest->paymentMethod->bank_name,
            'account' => $this->maskAccountNumber($balanceRequest->paymentMethod->account_number),
            'payment_amount' => $balanceRequest->received_amount,
            'name' => $balanceRequest->user->full_name,
            'issue_by' => 'chandima',
            'rate' => 100,

        ];

        // $paymentId = [1, 2, 3, 4, 5];

        foreach ($paymentIds as $payment) {
            $data['paymentRecords'][] = [
                'create_at' => $payment['payment']['created_at_human'],
                'description' => $payment['payment']['description'],
                'payment' => $payment['payment']['received_amount'],
            ];
        }
        // $data = [
        //     [
        //         'quantity' => 1,
        //         'description' => '1 Year Subscription',
        //         'price' => '129.00'
        //     ]
        // ];

        $pdf = Pdf::loadView('pdf.invoice', $data);

        return $pdf->download('invoice.pdf');
    }
}
