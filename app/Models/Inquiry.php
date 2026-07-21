<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inquiry extends Model
{
    use HasFactory;

    protected $fillable = [
        'inquiry_name',
        'phone',
        'email',
        'project_budget',
        'project_type',
        'message',
        'attachment_path',
        'status',
    ];
}
