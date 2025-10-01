<?php

namespace App\Http\Requests\Review;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class ReviewRequest extends FormRequest
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
            'recommend_rate' => 'required|numeric|min:0|max:5',
            'feedback' => 'required|string|max:5000',
            'contract_end_reason' => 'required|string',
            'english_proficiency' => 'required|string',
            'skills_rate' => 'required|numeric|min:0|max:5',
            'quality_rate' => 'required|numeric|min:0|max:5',
            'availability_rate' => 'required|numeric|min:0|max:5',
            'adherence_rate' => 'required|numeric|min:0|max:5',
            'communication_rate' => 'required|numeric|min:0|max:5',
            'cooperation_rate' => 'required|numeric|min:0|max:5',
            'avg_score_rate' => 'required|numeric|min:0|max:5',
            'your_experience' => 'required|string|max:5000',
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

            'recommend_rate.required' => 'The recommendation rate field is required.',
            'recommend_rate.numeric' => 'The recommendation rate field must be a number.',
            'recommend_rate.min' => 'The recommendation rate field must be at least 1.',
            'recommend_rate.max' => 'The recommendation rate field must be at most 5.',

            'feedback.required' => 'The feedback field is required.',
            'feedback.string' => 'The feedback field must be a string.',
            'feedback.max' => 'The feedback field may not be greater than 5000 characters.',
            'contract_end_reason.required' => 'The contract end reason field is required.',
            'english_proficiency.required' => 'The English proficiency field is required.',
            'skills_rate.required' => 'The skills rate field is required.',
            'skills_rate.numeric' => 'The skills rate field must be a number.',
            'skills_rate.min' => 'The skills rate field must be at least 1.',
            'skills_rate.max' => 'The skills rate field must be at most 5.',
            'quality_rate.required' => 'The quality rate field is required.',
            'quality_rate.numeric' => 'The quality rate field must be a number.',
            'quality_rate.min' => 'The quality rate field must be at least 1.',
            'quality_rate.max' => 'The quality rate field must be at most 5.',
            'availability_rate.required' => 'The availability rate field is required.',
            'availability_rate.numeric' => 'The availability rate field must be a number.',
            'availability_rate.min' => 'The availability rate field must be at least 1.',
            'availability_rate.max' => 'The availability rate field must be at most 5.',
            'adherence_rate.required' => 'The adherence rate field is required.',
            'adherence_rate.numeric' => 'The adherence rate field must be a number.',
            'adherence_rate.min' => 'The adherence rate field must be at least 1.',
            'adherence_rate.max' => 'The adherence rate field must be at most 5.',
            'communication_rate.required' => 'The communication rate field is required.',
            'communication_rate.numeric' => 'The communication rate field must be a number.',
            'communication_rate.min' => 'The communication rate field must be at least 1.',
            'communication_rate.max' => 'The communication rate field must be at most 5.',
            'cooperation_rate.required' => 'The cooperation rate field is required.',
            'cooperation_rate.numeric' => 'The cooperation rate field must be a number.',
            'cooperation_rate.min' => 'The cooperation rate field must be at least 1.',
            'cooperation_rate.max' => 'The cooperation rate field must be at most 5.',
            'avg_score_rate.required' => 'The average score rate field is required.',
            'avg_score_rate.numeric' => 'The average score rate field must be a number.',
            'avg_score_rate.min' => 'The average score rate field must be at least 1.',
            'avg_score_rate.max' => 'The average score rate field must be at most 5.',
            'your_experience.required' => 'The your experience field is required.',
            'your_experience.string' => 'The your experience field must be a string.',
            'your_experience.max' => 'The your experience field may not be greater than 5000 characters.',

        ];
    }
}
