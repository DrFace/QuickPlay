<?php

namespace App\Services\CountryService;

use Countries;

class CountryService
{
    public function getCountries()
    {
        $countries = Countries::getList('en', 'php');
        $countryArray = [];
        // $countryArray[] = [
        //     'value' => 'Sri Lanka',
        //     'label' => 'Sri Lanka',
        // ];
        foreach ($countries as $key => $value) {
            $countryArray[] = [
                'value' => $value,
                'label' => $value,
            ];
        }

        return $countryArray;
    }
}
