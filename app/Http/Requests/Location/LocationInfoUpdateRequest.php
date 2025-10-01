<?php

namespace App\Http\Requests\Location;

use Illuminate\Foundation\Http\FormRequest;

class LocationInfoUpdateRequest extends FormRequest
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
        return [
            'country' => 'required|string|max:255',
            'time_zone' => 'required|string|max:255',
            'address_line1' => 'required|string|max:50',
            'address_line2' => 'nullable|string|max:50',
            'address_line3' => 'nullable|string|max:50',
            'phone' => 'nullable|digits_between:10,15',
        ];
    }

    public function messages()
    {
        return [
            'phone.digits_between' => 'The phone number must be between 10 and 15 digits and contain only numbers.',
            'address_line1.max' => 'The address line 1 may not be greater than 50 characters.',
            'address_line2.max' => 'The address line 2 may not be greater than 50 characters.',
            'address_line3.max' => 'The address line 3 may not be greater than 50 characters.',
            'country.max' => 'The country may not be greater than 255 characters.',
            'time_zone.max' => 'The time zone may not be greater than 255 characters.',
            'country.required' => 'The country field is required.',
            'time_zone.required' => 'The time zone field is required.',
            'address_line1.required' => 'The address line 1 field is required.',
            'address_line2.required' => 'The address line 2 field is required.',
            'address_line3.required' => 'The address line 3 field is required.',
            'phone.required' => 'The phone number field is required.',
            'phone.digits_between' => 'The phone number must be between 10 and 15 digits and contain only numbers.',
            'country.required' => 'The country field is required.',
            'time_zone.required' => 'The time zone field is required.',
        ];
    }
}
