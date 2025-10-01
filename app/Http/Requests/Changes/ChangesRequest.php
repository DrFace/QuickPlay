<?php

namespace App\Http\Requests\Changes;

use Illuminate\Foundation\Http\FormRequest;

class ChangesRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'message' => 'required|string|max:1000',
            'offer_id' => 'required|string',
        ];
    }

    /**
     * Get the custom validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'message.required' => 'The message field is required.',
            'message.string' => 'The message field must be a string.',
            'message.max' => 'The message field must not exceed 1000 characters.',
            'offer_id.required' => 'The offer id field is required.',
            'offer_id.string' => 'The offer id field must be a string.',
        ];
    }
}
