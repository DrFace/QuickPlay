<?php

namespace App\Http\Traits;

use Illuminate\Support\Arr;

trait UtilityTrait
{
    /**
     * Method enumToArray
     *
     * @param  mixed  $enum  [explicite description]
     */
    public function enumToArray($enum): array
    {

        return Arr::map($enum, fn ($enum) => $enum->value);
    }

    /**
     * Method enumToSelect
     *
     * @param  mixed  $enum  [explicite description]
     */
    public function enumToSelect($enum): array
    {
        $arr = [];
        foreach ($this->enumToArray($enum) as $key => $value) {
            $arr[] = ['value' => $value, 'label' => ucwords($value)];
        }

        return $arr;
    }

    /**
     * randomKey
     *
     * @return void
     */
    public function randomKey()
    {
        return random_int(10, 10000);
    }

    /**
     * Get the past N days including today as labels
     *
     * @return array
     */
    public function getPastDays(int $days)
    {
        $dates = [];
        for ($i = 0; $i < $days; $i++) {
            $dates[] = now()->subDays($i)->format('Y-m-d');
        }
        $dates = array_reverse($dates);

        return $dates;
    }
}
