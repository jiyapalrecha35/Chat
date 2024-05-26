document.addEventListener('DOMContentLoaded', () => {
    // Select elements from the DOM
    const form = document.getElementById('send-container');
    const msginp = document.getElementById('msginp');
    const messageContainer = document.querySelector('.messages');
    const audio = new Audio('tone.mp3');

    // Function to append messages to the container
    const append = (message, pos) => {
        const messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.classList.add('message');
        messageElement.classList.add('message-' + pos);
        messageContainer.append(messageElement);
        if (pos === 'left') {
            audio.play().catch(error => {
                console.log('Audio play was prevented:', error);
            });
        }
    };

    const socket = io("http://localhost:8000");

    // Prompt the user for their name and give it to server
    const namee = prompt('Enter your name to join chat');
    socket.emit('new-user-joined', namee);

    //server se reposne mila
    socket.on('user-joined', data => {
        append(`${data} joined the chat!`, 'left');
    });

    //jab ek user bhejta hai sabko broadcast hoga
    socket.on('receive', data => {
        append(`${data.user}: ${data.message}`, 'left');
    });

    //chod diya chat
    socket.on('left', name => {
        append(`${name} left the chat!`, 'left');
    });

    //form submit hone par,menas send click karne par send
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = msginp.value;
        append(`You: ${message}`, 'right');
        socket.emit('send', message);
        msginp.value = "";
    });
});
