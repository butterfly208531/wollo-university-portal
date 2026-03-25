<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Policy extends Model
{
    protected $fillable = [
        'title_en', 'title_am', 'content_en', 'content_am',
        'category_id', 'page_number', 'version', 'tags', 'status',
        'created_by', 'updated_by',
    ];

    protected $casts = [
        'tags' => 'array',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function versions()
    {
        return $this->hasMany(PolicyVersion::class)->orderByDesc('created_at');
    }

    public function creator()
    {
        return $this->belongsTo(Admin::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(Admin::class, 'updated_by');
    }

    public function toApiArray(string $lang = 'en'): array
    {
        return [
            'id'          => $this->id,
            'title'       => ['en' => $this->title_en, 'am' => $this->title_am],
            'content'     => ['en' => $this->content_en, 'am' => $this->content_am],
            'category'    => $this->category?->slug,
            'category_id' => $this->category_id,
            'page_number' => $this->page_number,
            'version'     => $this->version,
            'tags'        => $this->tags ?? [],
            'status'      => $this->status,
            'created_at'  => $this->created_at?->toDateString(),
            'updated_at'  => $this->updated_at?->toDateString(),
        ];
    }
}
