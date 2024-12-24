<?php

namespace App\Models\User;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Like;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    /**
     * Get all the user's likes.
     */
    public function likes(): HasMany
    {
        return $this->hasMany(Like::class);
    }

    public function hasLikedLikable(int $likableId): bool
    {
        $this->loadIfMissing('likes');

        if (is_null($this->likedLikables)) {
            $this->likedLikables = [];

            foreach ($this->likes as $like) {
                $this->likedLikables[$like->likable_id] = $like;
            }
        }

        return array_key_exists($likableId, $this->likedLikables);
    }
}
