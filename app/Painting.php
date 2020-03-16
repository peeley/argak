<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Painting extends Model
{

    protected $fillable = ['title', 'strokes'];
    
    public function user(){
        return $this->belongsTo('App\User');
    }
}
