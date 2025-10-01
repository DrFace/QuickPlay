<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTwoFactorRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        /**
         * Get the validation rules that apply to the request.
         *
         * @return array
         */
        return [
            'otp' => 'required|digits:6',
        ];
    }

    public function messages()
    {
        /**
         * Get the custom validation messages for the request.
         *
         * @return array
         */
        return [
            'otp.required' => 'The OTP field is required.',
            'otp.digits' => 'The OTP field must be 6 digits.',
        ];
    }
}
