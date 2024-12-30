import './bootstrap';

import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;


console.log(Pusher)
const echo = new Echo({
    broadcaster: 'pusher',
    key: 'e030a1ce007b9a12dceb',
    cluster: 'eu',  // Укажите кластер, если нужно
    encrypted: true,
});

document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const messagesContainer = document.getElementById('messages-container');
    const chatForm = document.getElementById('chat-form');
    const messageInput = document.getElementById('message-input');
    const userName = document.getElementById('user-name');
    const userEmail = document.getElementById('user-email');

    // State
    let messages = [];
    let errors = [];
    const currentUser = { id: 1, name: "User Name" };  // Пример текущего пользователя

    // Fetch messages from the server
    const getMessages = async () => {
        try {
            const response = await axios.get('/messages');
            messages = response.data;
            renderMessages();
        } catch (error) {
            console.log('Error fetching messages:', error);
        }
    };

    // Render messages
    const renderMessages = () => {
        messagesContainer.innerHTML = ''; // Clear previous messages
        messages.forEach((message) => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('flex', 'items-end', message.user.id !== currentUser.id ? 'justify-start' : 'justify-end');

            const messageContent = document.createElement('div');
            messageContent.classList.add('flex', 'flex-col', 'space-y-2', 'text-xs', 'max-w-xs', 'mx-2', 'order-2');

            const userNameSpan = document.createElement('span');
            userNameSpan.classList.add('font-semibold', 'text-gray-800');
            userNameSpan.textContent = message.user.name;  // Display the user name

            const messageText = document.createElement('span');

            if (message.user.id !== currentUser.id) {
                messageText.classList.add('px-4', 'py-2', 'rounded-lg', 'inline-block', 'bg-blue-600', 'text-white', 'rounded-br-none');
            } else {
                messageText.classList.add('px-4', 'py-2', 'rounded-lg', 'inline-block', 'bg-gray-300', 'text-gray-600', 'rounded-bl-none');
            }

            messageText.textContent = message.message;

            messageContent.appendChild(userNameSpan);
            messageContent.appendChild(messageText);
            messageDiv.appendChild(messageContent);
            messagesContainer.appendChild(messageDiv);
        });

        // Scroll to the bottom of the container after rendering messages
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    };

    // Send a new message
    const sendMessage = async (message) => {
        try {
            const response = await axios.post('/send', { message });
            // Immediately add the message to the array and re-render
            messages.push(response.data);
            renderMessages();
            messageInput.value = ''; // Clear input after sending
        } catch (error) {
            if (error.response && error.response.status === 422) {
                errors = error.response.data.errors;
                console.error('Validation errors:', errors);
            }
        }
    };

    // Handle form submission
    chatForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            sendMessage(message); // Send message
        }
    });

    // Initialize and load messages when the page is loaded
    getMessages();

    // Subscribe to the channel and listen for new messages using Pusher and Echo
    echo.private('chat')
        .listen('MessageSent', (e) => {
            console.log("Received new message:", e.message); // Debug log to check the message
            messages.push(e.message);
            renderMessages(); // Re-render the messages immediately
        });
});
