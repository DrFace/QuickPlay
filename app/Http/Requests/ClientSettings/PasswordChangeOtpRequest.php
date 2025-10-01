<?php

namespace App\Http\Requests\ClientSettings;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Validator;

class PasswordChangeOtpRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        // Password::defaults(), 'confirmed'],
        return [
            'current_password' => 'required',
            'new_password' => 'required|min:8|regex:/[a-z]/|regex:/[A-Z]/|regex:/[0-9]/|regex:/[@$!%*#?&]/',
            'confirm_password' => 'required|same:new_password',
            'otp' => 'nullable',
            'email' => 'required|email|exists:users,email',
        ];
    }

    /**
     * Configure the validator instance to add custom logic.
     */
    public function withValidator(Validator $validator): void
    {
        $validator->after(function ($validator) {
            $user = User::where('email', $this->input('email'))->first();

            if ($user && ! Hash::check($this->input('current_password'), $user->password)) {
                $validator->errors()->add('current_password', 'The current password is incorrect.');
            }
        });
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'current_password.required' => 'Current password is required',
            'new_password.required' => 'New password is required',
            'new_password.min' => 'New password must be at least 8 characters',
            'new_password.regex' => 'New password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
            'confirm_password.required' => 'Confirm password is required',
            'confirm_password.same' => 'New password and confirm password must match',
            'email.required' => 'Email is required',
            'email.email' => 'Email must be a valid email address',
            'email.exists' => 'Email does not exist',
        ];
    }
}
