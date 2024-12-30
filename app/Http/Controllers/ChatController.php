<?php

namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Http\Requests\MessageFormRequest;
use App\Models\Message;

class ChatController extends Controller
{
    public function index()
    {
        $user = auth()->loginUsingId(1);

        return view('chat', compact('user'));
    }

    public function messages()
    {
        return Message::query()
            ->with('user')
            ->get();
    }

    public function send(MessageFormRequest $request)
    {
        $message = $request->user()
            ->messages()
            ->create($request->validated());
        broadcast(new MessageSent($request->user(), $message));
        return $message;
    }


}
