<?php

namespace App\Integrations;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TimeZoneIntegrations
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = Config('services.timezone.url');

    }

    public function getTimeZone()
    {
        try {
            $data = Http::get("$this->baseUrl");

            return $data->json();
        } catch (\Exception $e) {
            Log::error('Time Zone API Error:', ['message' => $e->getMessage()]);
        }

    }
}
