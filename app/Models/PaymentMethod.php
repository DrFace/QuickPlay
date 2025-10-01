<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'account_holder_name',
        'account_number',
        'iban_number',
        'country',
        'bank_name',
        'bank_address',

    ];

    public function user()
    {
        return $this->belongsTo(User::class)->withTrashed();
    }
}
