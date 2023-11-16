<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;

class Translations implements Castable
{
    public function __construct(public array $translations)
    {
    }

    /**
     * Adds a translation for the given language.
     */
    public function addTranslation(string $language, string $value): void
    {
        $this->translations[$language] = $value;
    }

    /**
     * Returns the translation in the given language.
     */
    public function getTranslation(string $language): string
    {
        return $this->translations[$language] ?? $this->translations[config('app.fallback_locale')];
    }

    /**
     * Returns the translation in the locale language.
     */
    public function getLocalTranslation(): string
    {
        return $this->getTranslation(App::getLocale());
    }

    /**
     * Get the caster class to use when casting from / to this cast target.
     */
    public static function castUsing(array $arguments): CastsAttributes
    {
        return new class implements CastsAttributes
        {
            /**
             * Cast the given value.
             */
            public function get(Model $model, string $key, mixed $value, array $attributes): Translations
            {
                return new Translations(json_decode($value, true));
            }

            /**
             * Prepare the given value for storage.
             */
            public function set(Model $model, string $key, mixed $value, array $attributes): string
            {
                if ($value instanceof Translations) {
                    return json_encode($value->translations);
                } elseif (is_string($value)) {
                    return json_encode([config('app.fallback_locale') => $value]);
                } elseif (is_array($value)) {
                    return json_encode($value);
                }

                throw new \InvalidArgumentException('The given value cannot be serialized.');
            }
        };
    }
}
