<?php

namespace App\Enums;

enum DepartmentType: string
{
    case HQ = 'HQ';
    case Regular = 'REGULAR';
    case Vendor = 'VENDOR';
}
