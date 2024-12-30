@extends('layouts.app')

@section('content')

    <div class="flex-1 p-4 sm:p-6 justify-between flex flex-col h-screen bg-gray-100">
        <!-- Header with user info -->
        <div class="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
            <div class="flex items-center space-x-4">
                <div class="flex flex-col leading-tight">
                    <div class="text-2xl mt-1 flex items-center">
                        <span class="text-gray-700 mr-3" id="user-name">{{auth()->user()->name}}</span>
                    </div>
                    <span class="text-lg text-gray-600" id="user-email">{{auth()->user()->email}}</span>
                </div>
            </div>
        </div>

        <!-- Messages container -->
        <div class="flex flex-col space-y-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch" id="messages-container">
            <!-- Messages will be injected here -->
        </div>

        <!-- Chat form -->
        <div class="border-t-2 border-gray-200 px-4 pt-4 mb-2 sm:mb-0">
            <form id="chat-form">
                <input type="text" id="message-input" class="w-full p-2 rounded-lg bg-white border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Type your message...">
                <button type="submit" class="w-full mt-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-400">Send</button>
            </form>
        </div>
    </div>


@endsection
