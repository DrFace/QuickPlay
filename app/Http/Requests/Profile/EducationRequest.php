<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class EducationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Update authorization logic if needed
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'school' => 'required|string|max:150',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'degree' => 'nullable|string|max:50',
            'area_of_study' => 'nullable|string|max:100',
            'description' => 'required|string|max:1000',
        ];
    }

    /**
     * Get the custom messages for validation errors.
     */
    public function messages(): array
    {
        return [
            'school.required' => 'The school field is required.',
            'school.string' => 'The school name must be a valid string.',
            'school.max' => 'The school name cannot exceed 150 characters.',

            'start_date.date' => 'The start date must be a valid date format.',
            'end_date.date' => 'The end date must be a valid date format.',
            'end_date.after_or_equal' => 'The end date cannot be before the start date.',

            'degree.string' => 'The degree must be a valid string.',
            'degree.max' => 'The degree cannot exceed 50 characters.',

            'area_of_study.string' => 'The area of study must be a valid string.',
            'area_of_study.max' => 'The area of study cannot exceed 100 characters.',

            'description.required' => 'The description field is required.',
            'description.string' => 'The description must be a valid string.',
            'description.max' => 'The description cannot exceed 1000 characters.',
        ];
    }
}
