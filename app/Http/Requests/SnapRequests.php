<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SnapRequests extends FormRequest
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
        return match ($this->method()) {
            'POST' => [
                'photo' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
            ],
            'PUT', 'PATCH' => [
                'photo' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048'
            ],
            default => []
        };
    }

    /**
     * Get custom error messages for validation rules.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'photo.required' => 'A photo is required.',
            'photo.image' => 'The uploaded file must be an image.',
            'photo.mimes' => 'Only JPEG, PNG, JPG, and GIF images are allowed.',
            'photo.max' => 'The image must not be larger than 2MB.',
        ];
    }
}
