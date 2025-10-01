<?php

namespace App\Http\Requests\Credit;

use Illuminate\Foundation\Http\FormRequest;

class StoreCreditRequest extends FormRequest
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
        return [
            'selected_amount' => 'nullable|numeric',
            'amount' => 'nullable|numeric',
            'tax' => 'nullable|numeric',
            'connects' => 'nullable|integer',
            'available_connects' => 'nullable|integer',
            'expire_date' => 'required|date',
        ];
    }
}
