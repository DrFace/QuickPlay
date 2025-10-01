<?php

namespace App\Http\Requests\Admin;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class SkillCategoryRequest extends FormRequest
{
    use UtilityTrait;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge([
            'slug' => Str::slug($this->slug),
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255|regex:/[a-zA-Z]/',
            'status' => 'required|string|max:255',
        ];

        if ($this->input('type') === 'edit') {
            $rules['name'] = 'required|string|max:255|regex:/[a-zA-Z]/'; // Just make it required, no uniqueness check.
        } else {
            $rules['name'] = 'required|string|unique:skill_categories,name|max:255|regex:/[a-zA-Z]/';
        }

        return $rules;
    }

    /**
     * Get the custom validation messages for the request.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name field must be a string.',
            'name.max' => 'The name field may not be greater than 255 characters.',
            'name.regex' => 'The name field must contain at least one alphabet.',
            'name.unique' => 'The name has already been taken.',
            'status.required' => 'The status field is required.',
            'status.string' => 'The status field must be a string.',
            'status.max' => 'The status field may not be greater than 255 characters.',
            'name.regex' => 'The name field must contain only letters.',
        ];
    }
}
