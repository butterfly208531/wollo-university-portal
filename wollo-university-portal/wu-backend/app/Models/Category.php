<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    protected $fillable = ['slug', 'name_en', 'name_am', 'description', 'order'];

    public function policies()
    {
        return $this->hasMany(Policy::class);
    }

    public function toApiArray(): array
    {
        return [
            'id'    => $this->id,
            'slug'  => $this->slug,
            'name'  => ['en' => $this->name_en, 'am' => $this->name_am],
            'order' => $this->order,
            'count' => $this->policies_count ?? 0,
        ];
    }
}
