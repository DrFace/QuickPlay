<?php

namespace App\Http\Requests\Admin;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class ConnectPackageRequest extends FormRequest
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
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'connects' => 'required|integer|min:1', // Allow 0 or any positive integer
            'amount' => 'required|numeric|min:1',
            'status' => 'required|string|max:255',
        ];

        return $rules;
    }

    /**
     * Get the error messages for the defined validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'connects.required' => 'Connects is required',
            'connects.integer' => 'Connects must be an integer',
            'connects.min' => 'Connects must be at least 1',
            'amount.required' => 'Amount is required',
            'amount.numeric' => 'Amount must be a number',
            'amount.min' => 'Amount must be at least 1',
            'status.required' => 'Status is required',
            'status.string' => 'Status must be a string',
            'status.max' => 'Status must not exceed 255 characters',

        ];
    }
}
