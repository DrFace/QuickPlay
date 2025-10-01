<?php

namespace App\Http\Requests\Ticket;

use Illuminate\Foundation\Http\FormRequest;

class TicketRequest extends FormRequest
{
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
            'subject' => [
                'required',
                'string',
                'regex:/[a-zA-Z]/',
            ],
            'category' => 'required|string',
            'description' => [
                'required',
                'string',
                'regex:/[a-zA-Z]/',
            ],
        ];
    }
}
