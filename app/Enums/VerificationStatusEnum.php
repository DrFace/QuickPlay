<?php

namespace App\Enums;

enum VerificationStatusEnum: string
{
    // case Pending = 'pending';
    case Rejected = 'rejected';
    case Verified = 'verified';
}
