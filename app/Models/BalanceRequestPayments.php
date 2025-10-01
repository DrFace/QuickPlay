<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BalanceRequestPayments extends Model
{
    use HasFactory;

    protected $fillable = [
        'balance_request_id',
        'payment_id',
    ];

    public function balanceRequest()
    {
        return $this->belongsTo(BalanceRequest::class);
    }

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
