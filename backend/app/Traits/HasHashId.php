<?php

namespace App\Traits;

use Illuminate\Support\Arr;

trait HasHashId
{
    public function usesUniqueIds()
    {
        return true;
    }

    public function newUniqueId(): int
    {
        $idAttributes = Arr::map($this->idHashAttributes, [$this, 'getAttribute']);
        $hash = str(implode('-', $idAttributes))->pipe(fn ($id) => hash('sha256', $id))->take(15);

        return (int) hexdec($hash);
    }

    public function uniqueIds(): array
    {
        return ['id'];
    }

    public static function hashId(array $attributes): int
    {
        $model = (new self($attributes));
        if (! Arr::has($attributes, $model->idHashAttributes)) {
            $class = self::class;
            $missing = json_encode(
                array_values(array_diff($model->idHashAttributes, array_keys($attributes)))
            );

            throw new \ValueError("Missing $missing id hash attributes on $class");
        }

        $model->setUniqueIds();

        return $model->id;
    }
}
