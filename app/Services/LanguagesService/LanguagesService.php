<?php

namespace App\Services\LanguagesService;

use App\Integrations\LanguagesIntegrations;

class LanguagesService
{
    public function __construct(
        protected LanguagesIntegrations $languagesIntegrations,
    ) {}

    public function getLanguages()
    {
        $response = $this->languagesIntegrations->getLanguages();
        $languages = [];

        foreach ($response as $key => $value) {
            $languages[] = [
                'value' => $value['name'],
                'label' => $value['name'],
            ];
        }

        // Add Sinhala to the end of the array
        $languages[] = [
            'value' => 'Sinhala',
            'label' => 'Sinhala',
        ];

        return $languages;
    }
}
