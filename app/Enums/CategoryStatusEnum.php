<?php

namespace App\Enums;

enum CategoryStatusEnum: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Inactive = 'inactive';
}
