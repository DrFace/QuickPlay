<?php

namespace App\Http\Requests\Milestone;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class ClientCreateMilestoneRequest extends FormRequest
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
        return [

            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'due_date' => 'required|date',
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
            'amount.required' => 'The amount field is required.',
            'amount.numeric' => 'The amount field must be a number.',
            'description.required' => 'The description field is required.',
            'description.string' => 'The description field must be a string.',
            'description.max' => 'The description field must not exceed 1000 characters.',
            'due_date.required' => 'The due date field is required.',
            'due_date.date' => 'The due date field must be a date.',
        ];
    }
}
