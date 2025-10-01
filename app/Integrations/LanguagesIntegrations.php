<?php

namespace App\Integrations;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class LanguagesIntegrations
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = Config('services.languages.url');

    }

    public function getLanguages()
    {
        try {
            $data = Http::get("$this->baseUrl");

            return $data->json();
        } catch (\Exception $e) {
            Log::error('Time Zone API Error:', ['message' => $e->getMessage()]);
        }

    }
}
