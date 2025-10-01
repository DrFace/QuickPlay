<?php

namespace App\Http\Requests\Banks;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class BankRequest extends FormRequest
{
    use UtilityTrait;

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
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'country' => 'required|string|max:255',
            'bank_name' => 'required|string|max:255|regex:/[a-zA-Z]/',
            'bank_address' => 'required|string|max:255|regex:/[a-zA-Z]/',
            'status' => 'required|string|max:255',
            'type' => 'required|string|max:255',
        ];

        if ($this->input('type') === 'edit') {
            $rules['bank_name'] = 'required|string|max:255|regex:/[a-zA-Z]/'; // Just make it required, no uniqueness check.
        } else {
            $rules['bank_name'] = 'required|string|unique:bank_details,bank_name|max:255|regex:/[a-zA-Z]/';
        }

        return $rules;
    }

    /**
     * Get the custom validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'country.required' => 'The country field is required.',
            'country.string' => 'The country field must be a string.',
            'country.max' => 'The country field may not be greater than 255 characters.',
            'bank_name.required' => 'The bank name field is required.',
            'bank_name.string' => 'The bank name field must be a string.',
            'bank_name.max' => 'The bank name field may not be greater than 255 characters.',
            'bank_name.unique' => 'The bank name has already been taken.',
            'bank_name.regex' => 'The bank name field must contain only letters, numbers and spaces.',
            'bank_address.required' => 'The bank address field is required.',
            'bank_address.string' => 'The bank address field must be a string.',
            'bank_address.max' => 'The bank address field may not be greater than 255 characters.',
            'bank_address.regex' => 'The bank address field must contain only letters, numbers and spaces.',
            'status.required' => 'The status field is required.',
            'status.string' => 'The status field must be a string.',
            'status.max' => 'The status field may not be greater than 255 characters.',
            'type.required' => 'The type field is required.',
            'type.string' => 'The type field must be a string.',
            'type.max' => 'The type field may not be greater than 255 characters.',
        ];
    }
}
