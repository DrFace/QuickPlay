<?php

namespace App\Services\TimeZoneService;

use App\Integrations\TimeZoneIntegrations;

class TimeZoneService
{
    public function __construct(
        protected TimeZoneIntegrations $timeZoneIntegrations,
    ) {}

    public function getTimeZones()
    {
        $timeZoneOptions = \DateTimeZone::listIdentifiers();
        $options = [];
        foreach ($timeZoneOptions as $key => $value) {
            $options[] = [
                'value' => $value,
                'label' => $value,
            ];
        }

        return $options;
    }
}
