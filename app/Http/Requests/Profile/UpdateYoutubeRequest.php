<?php

namespace App\Http\Requests\Profile;

use Illuminate\Foundation\Http\FormRequest;

class UpdateYoutubeRequest extends FormRequest
{
    public function authorize()
    {
        // Return true to allow the request, add any authorization logic if needed
        return true;
    }

    public function rules()
    {
        return [
            'video_link' => [
                'required',
                'regex:/^(https?:\/\/)?(www\.)?(youtube\.com)\/?(watch\?v=)?([a-zA-Z0-9_-]{11})$/',
                'string',
                'max:255',
            ],
            'video_type' => 'required|string|max:255',
        ];
    }

    public function messages()
    {
        return [
            'video_link.required' => 'Please enter a YouTube video link.',
            'video_link.regex' => 'Please enter a valid YouTube video link.(e.g. https://www.youtube.com/watch?v=XXXXXXXXXXX)',
            'video_type.required' => 'Please select the type of video.',
            'video_type.string' => 'The video type must be a valid string.',
            'video_type.max' => 'The video type cannot exceed 255 characters.',
            'video_link.string' => 'The video link must be a valid string.',
            'video_link.max' => 'The video link cannot exceed 255 characters.',
        ];
    }
}
