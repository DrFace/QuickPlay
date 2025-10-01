<?php

namespace App\Http\Requests\Portfolio;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Validator;

class PortfolioRequest extends FormRequest
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
        // dd($this->all());
        return [
            'title' => 'required|string|max:255',
            'role' => 'nullable|string|max:255',
            'skills' => 'required|string|max:255',
            'description' => 'required|string|max:1000',
            // Check if 'image' is either a string (path) or a valid file upload
            'image' => ['required', function ($attribute, $value, $fail) {
                // If it's a string (assumed file path), it's valid
                if (is_string($value)) {
                    return;
                }

                // If it's a file, apply file validation rules
                $rules = 'file|mimes:png,jpg,jpeg|max:10240';
                $validator = Validator::make([$attribute => $value], [$attribute => $rules]);

                if ($validator->fails()) {
                    $fail('The image must be a valid file or a valid string path.');
                }
            }],

        ];
    }
}
