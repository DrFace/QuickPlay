<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class NameUpdateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        // You can add additional authorization logic if needed
        return true; // Allow all authenticated users to proceed
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
        ];

    }

    public function messages()
    {
        return [
            'first_name.regex' => 'The first name must not contain spaces.',
            'last_name.regex' => 'The last name must not contain spaces.',
        ];
    }
}
