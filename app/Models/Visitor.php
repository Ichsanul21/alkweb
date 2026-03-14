<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visitor extends Model
{
    protected $fillable = [
        'ip_address',
        'device_type',
        'browser',
        'country',
        'region',
        'city',
        'latitude',
        'longitude',
        'zipcode',
        'timezone',
        'visited_date',
    ];

    protected $casts = [
        'visited_date' => 'date',
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
    ];
}
