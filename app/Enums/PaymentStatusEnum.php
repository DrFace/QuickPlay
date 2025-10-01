<?php

namespace App\Enums;

enum PaymentStatusEnum: string
{
    case Pending = 'pending';
    case Succeeded = 'succeeded';
    case Refunded = 'refunded';
    case Failed = 'failed';
}
