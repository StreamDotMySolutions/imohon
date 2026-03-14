<?php

namespace App\Enums;

enum RoleName: string
{
    case User = 'User';
    case Manager = 'Manager';
    case Admin = 'Admin';
    case GeneralManager = 'GeneralManager';
    case Vendor = 'Vendor';

    /**
     * @return list<string>
     */
    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }
}
