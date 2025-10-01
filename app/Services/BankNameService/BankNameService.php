<?php

namespace App\Services\BankNameService;

use App\Models\BankDetails;
use Illuminate\Support\Collection;

class BankNameService
{
    protected BankDetails $bankDetailsModel;

    /**
     * Get all bank names.
     */
    public function getAllBankNames(): Collection
    {
        return collect(BankDetails::getBankNames())->map(function ($name) {
            return [
                'label' => $name,
                'value' => $name,
            ];
        });
    }

    public function getAllBankAddress(): Collection
    {
        return collect(BankDetails::getBankAddress())->map(function ($address) {
            return [
                'label' => $address,
                'value' => $address,
            ];
        });
    }
}
