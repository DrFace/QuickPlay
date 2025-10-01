<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth; // Import the Auth facade
use Illuminate\Validation\Rule;

class StorePaymentMethodRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'accountHolderName' => 'required|string|max:150|regex:/[a-zA-Z]/',
            'accountNumber' => [
                'required',
                'string',
                'max:50',
                'regex:/^\d+$/',
                Rule::unique('payment_methods', 'account_number')
                    ->where(function ($query) {
                        return $query->where('user_id', Auth::id());
                    }),
            ],
            'ibanNumber' => [
                'required',
                'string',
                'max:40',
                'regex:/^(?=.*[a-zA-Z0-9])[a-zA-Z0-9!@#$%^&*()_+={}\[\]:;"\'<>,.?\/\\-]*$/',
                Rule::unique('payment_methods', 'iban_number')
                    ->where(function ($query) {
                        return $query->where('user_id', Auth::id());
                    }),
            ],
            'country' => 'required|string|max:100',
            'bankName' => 'required|string|max:100',
            'bankAddress' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'accountHolderName.required' => 'Account Holder Name is required.',
            'accountHolderName.regex' => 'Account holder name must contain at least one letter.',
            'accountHolderName.max' => 'Account Holder Name must not exceed 150 characters.',

            'accountNumber.required' => 'Account Number is required.',
            'accountNumber.max' => 'Account Number must not exceed 50 characters.',
            'accountNumber.regex' => 'Account Number should contain only numbers.',
            'accountNumber.unique' => 'This Account Number already exists in your saved payment methods.',

            'ibanNumber.required' => 'IBAN Number is required.',
            'ibanNumber.max' => 'IBAN Number must not exceed 40 characters.',
            'ibanNumber.regex' => 'IBAN Number should contain only letters and numbers.',
            'ibanNumber.unique' => 'This IBAN Number already exists in your saved payment methods.',

            'country.required' => 'Country is required.',
            'bankName.required' => 'Bank Name is required.',
            'bankAddress.required' => 'Bank Address is required.',
        ];
    }
}
