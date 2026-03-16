<?php

namespace App\Enums;

enum ItemStatus: string
{
    case InStock     = 'in_stock';
    case Distributed = 'distributed';
    case Accepted    = 'accepted';
    case Missing     = 'missing';
    case Damaged     = 'damaged';
    case WrongItem   = 'wrong_item';
}
