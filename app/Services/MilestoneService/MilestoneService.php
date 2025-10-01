<?php

namespace App\Services\MilestoneService;

class MilestoneService
{
    public function __construct() {}

    public function betweenTwoDates($startDate, $endDate)
    {
        $midpoint = $startDate->addDays($startDate->diffInDays($endDate) / 2);

        return $midpoint;
    }
}
