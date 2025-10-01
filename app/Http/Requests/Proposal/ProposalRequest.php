<?php

namespace App\Http\Requests\Proposal;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProposalRequest extends FormRequest
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
            'duration' => 'required|string',
            'bid_amount' => 'required|numeric|min:1',
            'description' => 'required|string|max:1000',
            'attachment.*' => 'nullable|file|mimes:pdf,doc,docx,txt,png,jpg,jpeg,zip,rar|max:102400',
            'paidType' => 'required|string',

            // Make milestones an array, but don’t enforce individual fields yet
            'milestones' => 'nullable|array',
            'milestones.*.description' => 'nullable|string',
            'milestones.*.dueDate' => 'nullable|date',
            'milestones.*.amount' => 'nullable|numeric|min:1',
        ];
    }

    public function withValidator($validator)
    {
        // Check if paidType is 'Milestone' to apply additional rules
        $validator->sometimes('milestones.*.description', 'required', function ($input) {
            return $input->paidType === 'Milestone';
        });

        $validator->sometimes('milestones.*.dueDate', 'required|date', function ($input) {
            return $input->paidType === 'Milestone';
        });

        $validator->sometimes('milestones.*.amount', 'required|numeric|min:1', function ($input) {
            return $input->paidType === 'Milestone';
        });
    }

    /**
     * Get the custom validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'attachment.*.mimes' => 'Each attachment must be a file of type: pdf, doc, docx, txt, png, jpg, jpeg, zip, rar.',
            'attachment.*.max' => 'Each attachment may not be greater than 100MB.',
            'description.required' => 'The Cover Letter field is required.',
            'bid_amount.required' => 'The Bid Amount field is required.',
            'bid_amount.numeric' => 'The Bid Amount field must be a number.',
            'bid_amount.min' => 'The Bid Amount field cannot be less than 1.',
            'duration.required' => 'The Duration field is required.',
            'milestones.required_if' => 'Milestones are required when the payment type is Milestone.',
            'milestones.array' => 'The Milestones field must be an array.',
            'milestones.*.description.required' => 'The Milestone Description field is required.',
            'milestones.*.dueDate.required' => 'The Milestone Due Date field is required.',
            'milestones.*.dueDate.date' => 'The Milestone Due Date field must be a valid date.',
            'milestones.*.amount.required' => 'The Milestone Amount field is required.',
            'milestones.*.amount.numeric' => 'The Milestone Amount field must be a number.',
            'milestones.*.amount.min' => 'The Milestone Amount field cannot be less than 1.',
        ];
    }
}
