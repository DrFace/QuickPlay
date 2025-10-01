<?php

namespace App\Http\Requests\Languages;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class LanguageRequest extends FormRequest
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
            'language' => 'required|string|max:255',
            'level' => 'required|string|max:255',
        ];
    }
}
