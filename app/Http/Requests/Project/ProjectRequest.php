<?php

namespace App\Http\Requests\Project;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class ProjectRequest extends FormRequest
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
            'attachment' => 'required|max:51200|mimes:zip,rar',
            'attachments.*' => 'nullable|file|max:51200|mimes:zip,rar',
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
            'attachment.required' => 'Please upload a file',
            'attachment.max' => 'File size should not exceed 50MB',
            'attachment.mimes' => 'File type should be zip or rar',

        ];
    }
}
