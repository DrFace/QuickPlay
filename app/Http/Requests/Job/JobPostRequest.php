<?php

namespace App\Http\Requests\Job;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class JobPostRequest extends FormRequest
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
            'title' => 'required|string|max:255|regex:/[a-zA-Z]/',
            'category_id' => 'required|exists:job_categories,id',
            'skills' => 'required|array',
            'scope_size' => 'required|string|max:255',
            'scope_duration' => 'required|string|max:255',
            'scope_experience' => 'required|string|max:255',
            'budget' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'attachment.*' => 'nullable|file|mimes:pdf,doc,pptx,docx,txt,png,jpg,jpeg,zip,rar|max:102400',
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
            // 'attachment.*.file' => 'Each attachment must be a valid file.',
            'attachment.*.mimes' => 'Each attachment must be a file of type: pdf, doc, docx, txt, png, jpg, jpeg, zip, rar.',
            'attachment.*.max' => 'Each attachment may not be greater than 100MB.',
            'category_id.exists' => 'The selected category is invalid.',
            'category_id.required' => 'The selected category is required.',
            'budget.required' => 'The budget field is required.',
            'budget.numeric' => 'The budget field must be a number.',
            'budget.min' => 'The budget field must be a positive number.',
            'description.required' => 'The description field is required.',
            'description.max' => 'The description field may not be greater than 1000 characters.',
            'skills.required' => 'The skills field is required.',
            'skills.array' => 'The skills field must be an array.',
            'scope_size.required' => 'The scope size field is required.',
            'scope_duration.required' => 'The scope duration field is required.',
            'scope_experience.required' => 'The scope experience field is required.',
            'scope_size.max' => 'The scope size field may not be greater than 255 characters.',
            'scope_duration.max' => 'The scope duration field may not be greater than 255 characters.',
            'scope_experience.max' => 'The scope experience field may not be greater than 255 characters.',
            'title.required' => 'The title field is required.',
            'title.string' => 'The title field must be a string.',
            'title.max' => 'The title field may not be greater than 255 characters.',
            'title.regex' => 'The title field must contain alphabetic characters.',

        ];
    }
}
