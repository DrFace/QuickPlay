<?php

namespace App\Enums;

enum AdminStatusEnum: string
{
    case Pending = 'pending';
    case Approved = 'approved';
    // case Rejected = 'rejected';
}
