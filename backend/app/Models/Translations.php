<?php

namespace App\Models;

use Illuminate\Contracts\Database\Eloquent\Castable;
use Illuminate\Contracts\Database\Eloquent\CastsAttributes;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\App;
use JsonSerializable;

class Translations implements Castable, JsonSerializable
{
    public function __construct(public array $translations)
    {
    }

    public function __toString(): string
    {
        return json_encode($this->getLocalTranslation());
    }

    public function jsonSerialize(): mixed
    {
        return $this->getLocalTranslation();
    }

    /**
     * Returns the languages that have translations.
     */
    public function getLanguages(): array
    {
        return array_keys($this->translations);
    }

    /**
     * Returns whether the given language has a translation.
     */
    public function hasLanguage(string $language): bool
    {
        return array_key_exists($language, $this->translations);
    }

    /**
     * Adds a translation for the given language.
     */
    public function setTranslation(string $language, mixed $value): void
    {
        $this->translations[$language] = $value;
    }

    /**
     * Returns the translation for the given language.
     */
    public function getTranslation(string $language): mixed
    {
        return $this->translations[$language] ?? null;
    }

    /**
     * Maps each translation using the givin callback.
     */
    public function mapTranslations(callable $callback): void
    {
        $this->translations = array_map($callback, $this->translations);
    }

    /**
     * Returns the translation for the locale language. If there isn't a translation for
     * the locale language it defaults to the first available translation.
     */
    public function getLocalTranslation(): mixed
    {
        if ($this->hasLanguage(App::getLocale())) {
            return $this->translations[App::getLocale()];
        } elseif (count($this->translations) == 0) {
            return null;
        }

        return head($this->translations);
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
                return new Translations(json_decode($value ?? '[]', true));
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
