<?php

namespace App\Actions;

use Dedoc\Scramble\Extensions\OperationExtension;
use Dedoc\Scramble\Support\Generator\Operation;
use Dedoc\Scramble\Support\Generator\Parameter;
use Dedoc\Scramble\Support\Generator\Schema;
use Dedoc\Scramble\Support\Generator\Types\StringType;
use Dedoc\Scramble\Support\RouteInfo;

class ConfigureScramble extends OperationExtension
{
    public function handle(Operation $operation, RouteInfo $routeInfo)
    {
        $operation->addParameters([
            Parameter::make('Accept-Language', 'header')
                ->setSchema(
                    Schema::fromType(new StringType())
                )
                ->required(false),
        ]);
    }
}
