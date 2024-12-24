<?php

namespace App\Helpers;

use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;

class TranslationCast implements CastsAttributes
{
    /**
     * Cast the given value.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function get(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        $translations = json_decode($attributes[$key], true);
        if (empty($translations)) {
            return null;
        }

        $defaultLocale = app()->getLocale();
        if (array_key_exists($defaultLocale, $translations)) {
            return $translations[$defaultLocale];
        }

        $fallbackLocale = array_key_first($translations);

        return is_array($translations[$fallbackLocale])
            ? collect($translations[$fallbackLocale])
            : $translations[$fallbackLocale];
    }

    /**
     * Prepare the given value for storage.
     *
     * @param  array<string, mixed>  $attributes
     */
    public function set(Model $model, string $key, mixed $value, array $attributes): mixed
    {
        $isTranslationArray = collect($value)->every(
            fn ($_, $key) => in_array($key, config('app.valid_locales'))
        );
        if ($isTranslationArray) {
            return json_encode($value);
        }

        $translations = json_decode($attributes[$key], true) ?? [];

        $defaultLocale = app()->getLocale();
        if (array_key_exists($defaultLocale, $translations)) {
            $translations[$defaultLocale] = $value;
        } else {
            $fallbackLocale = array_key_first($translations);
            $translations[$fallbackLocale] = $value;
        }

        $translations = Arr::whereNotNull($translations);
        if (empty($translations)) {
            return null;
        }

        return json_encode($translations);
    }
}
