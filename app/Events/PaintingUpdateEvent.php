<?php

namespace App\Events;

use App\Http\Requests\PaintingUpdateRequest as Request;
use App\Painting;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaintingUpdateEvent implements ShouldBroadcast {

    use Dispatchable, InteractsWithSockets, SerializesModels;

    public int $paintingId;
    public $action;
    public $strokes;
    public $title;

    public function __construct(array $update, Painting $painting)
    {
        $this->paintingId = $painting->id;
        $this->action = $update['action'] ?? null;
        $this->strokes = isset($update['strokes']) ? json_decode($update['strokes']) : null;
        $this->title = $update['title'] ?? null;
    }

    public function broadcastOn()
    {
        return ['painting.' . $this->paintingId];
    }
}