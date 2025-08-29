// Function to show a specific page
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Global variables
let userProfile = null;
const socket = io();

// Handle Google Login response
function handleCredentialResponse(response) {
    const id_token = response.credential;
    
    // Send token to your backend for verification
    fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: id_token })
    })
    .then(res => res.json())
    .then(data => {
        userProfile = data.user;
        document.getElementById('username').textContent = userProfile.name;
        showPage('lobby-page');
        // Request room list from server
        socket.emit('get-rooms');
    })
    .catch(error => console.error('Error logging in:', error));
}

// Socket.IO event listeners
socket.on('connect', () => {
    console.log('Connected to server.');
});

socket.on('rooms-list', (rooms) => {
    const roomList = document.getElementById('room-list');
    roomList.innerHTML = '';
    rooms.forEach(room => {
        const li = document.createElement('li');
        li.textContent = `Room ID: ${room.id} (${room.players} players)`;
        li.onclick = () => {
            socket.emit('join-room', { roomId: room.id, user: userProfile });
        };
        roomList.appendChild(li);
    });
});

socket.on('room-joined', (room) => {
    console.log('Joined room:', room.id);
    showPage('table-page');
    // Here you would add code to render the poker table, players, etc.
});

// Example of a button click event
document.getElementById('create-room-btn').addEventListener('click', () => {
    socket.emit('create-room', { user: userProfile });
});

// You'll need more event listeners for game actions (fold, call, raise)
// and for handling game updates (deal cards, new turn, etc.)