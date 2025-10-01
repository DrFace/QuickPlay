<?php

namespace App\Http\Requests\Offer;

use App\Http\Traits\UtilityTrait;
use Illuminate\Foundation\Http\FormRequest;

class OfferPriceRequest extends FormRequest
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
            'offer_price' => 'required|numeric|min:1',
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
            'offer_price.required' => 'The offer price is required.',
            'offer_price.numeric' => 'The offer price must be a number.',
            'offer_price.min' => 'The offer price must be at least 1.',
        ];
    }
}
