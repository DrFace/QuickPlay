<?php

namespace App\Http\Requests\Account;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePasswordRequest extends FormRequest
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
            'current_password' => 'required',
            'new_password' => 'required|string|min:8',
            'confirm_password' => 'required|same:new_password',
            'otp' => 'sometimes|required|string|min:6|max:6|exists:users,otp',
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
            'current_password.required' => 'The current password field is required.',
            'new_password.required' => 'The new password field is required.',
            'new_password.string' => 'The new password field must be a string.',
            'new_password.min' => 'The new password field must be at least 8 characters.',
            'confirm_password.required' => 'The confirm password field is required.',
            'confirm_password.same' => 'The confirm password field and new password field must match.',
            'otp.required' => 'The OTP field is required.',
            'otp.string' => 'The OTP field must be a string.',
            'otp.min' => 'The OTP field must be at least 6 characters.',
            'otp.max' => 'The OTP field must not exceed 6 characters.',
            'otp.exists' => 'The OTP field is invalid.',
        ];
    }
}
