<?php

namespace App\Integrations;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyIntegrations
{
    protected $baseUrl;

    public function __construct()
    {
        $this->baseUrl = Config('services.currency_system.url');

    }

    public function getFromCurrencyUrl()
    {
        try {
            $data = Http::get("$this->baseUrl/latest?apikey=32cfad577dac407c9525416e8ca6c2bc");

            return $data->json();
        } catch (\Exception $e) {
            Log::error('Currency API Error:', ['message' => $e->getMessage()]);
        }

    }
}
