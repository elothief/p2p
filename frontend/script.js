// script.js
let ws; // WebSocket connection

// Connect to the WebSocket server
const connectToNetwork = () => {
  ws = new WebSocket('ws://localhost:5000'); // Connect to backend P2P server

  // When connection is established, set up event listeners
  ws.onopen = () => {
    console.log('Connected to the network');
  };

  // Listen for messages from the server (e.g., updates about connected peers)
  ws.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === 'peer_update') {
      // Update the peer list
      updatePeerList(data.peers);
    }
  };

  // Handle closed connection (i.e., if user was denied access)
  ws.onclose = () => {
    console.log('Connection closed. You are already a part of the network or a duplicate connection attempt.');
  };
};

// Update the UI with the list of connected peers
const updatePeerList = (peersList) => {
  const peerListElement = document.getElementById('peerList');
  peerListElement.innerHTML = ''; // Clear the current list

  peersList.forEach(peer => {
    const peerItem = document.createElement('li');
    peerItem.textContent = peer; // Display the full, descriptive peer info
    peerListElement.appendChild(peerItem);
  });
};

// Handle the "Join Network" button click
document.getElementById('joinNetworkBtn').addEventListener('click', () => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'join' }));
  } else {
    connectToNetwork();
  }
});
