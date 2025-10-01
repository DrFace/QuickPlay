<?php

namespace App\Enums;

enum SkillCategoryStatusEnum: string
{
    case Draft = 'draft';
    case Active = 'active';
    case Inactive = 'inactive';
}
