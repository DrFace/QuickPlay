<?php

namespace App\Http\Requests\Auth;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // You can add additional authorization logic if needed
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'first_name' => 'required|regex:/^\S*$/|string|max:50|alpha',
            'last_name' => 'required|regex:/^\S*$/|string|max:50|alpha',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', 'regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/', Rules\Password::defaults()],
            'country' => 'required|string|max:255',
            'time_zone' => 'required|string|max:255',
            'type' => 'required|string|max:255|in:client,freelancer',
            'emailNotification' => 'nullable|boolean',
            'terms' => 'required|boolean',
        ];

    }

    public function messages()
    {
        return [
            'first_name.regex' => 'The first name must not contain spaces.',
            'last_name.regex' => 'The last name must not contain spaces.',
            'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, and one number.',
            'email.unique' => 'The email has already been taken.',
            'terms.required' => 'You must agree to the terms and conditions.',
            'emailNotification.boolean' => 'The email notification field must be a boolean value.',
            'type.in' => 'The selected type is invalid.',
            'country.required' => 'The country field is required.',
            'time_zone.required' => 'The time zone field is required.',
            'first_name.alpha' => 'The first name must contain only alphabetical characters.',
            'last_name.alpha' => 'The last name must contain only alphabetical characters.',
            'email.email' => 'The email format is invalid.',
            'password.confirmed' => 'The password confirmation does not match.',
            'password.min' => 'The password must be at least 8 characters long.',
            'password.required' => 'The password field is required.',
            'password.regex' => 'The password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ( @$!%*?& ).',
            'first_name.max' => 'The first name may not be greater than 50 characters.',
            'last_name.max' => 'The last name may not be greater than 50 characters.',
            'email.max' => 'The email may not be greater than 255 characters.',
            'country.max' => 'The country may not be greater than 255 characters.',
            'time_zone.max' => 'The time zone may not be greater than 255 characters.',
            'type.max' => 'The type may not be greater than 255 characters.',
            'first_name.required' => 'The first name field is required.',
            'last_name.required' => 'The last name field is required.',
            'email.required' => 'The email field is required.',
            'type.required' => 'The type field is required.',

        ];
    }
}
