<?php

namespace App\Exports;

use App\Models\BalanceRequest;
use Illuminate\Support\Facades\Auth;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;

class PaymentsExport implements FromCollection, WithHeadings
{
    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        $payments = BalanceRequest::where('user_id', Auth::id())
            ->with('paymentMethod')
            ->get();

        // Map the payments to the desired format and return as a new collection
        return $payments->map(function ($payment) {
            return [
                'Amount' => $payment->amount,
                'Received Amount' => $payment->received_amount,
                'Bank' => $payment->paymentMethod->bank_name,
                'Account' => (string) $payment->paymentMethod->account_number,
                'Status' => $payment->status,
                'Created At' => $payment->created_at_human,
            ];
        });
    }

    public function headings(): array
    {
        return [
            'Amount ($)',
            'Received Amount ($)',
            'Bank',
            'Account',
            'Status',
            'Created At',
        ];
    }
}
