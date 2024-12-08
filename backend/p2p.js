const WebSocket = require('ws');

// Basic peer-to-peer node with WebSocket
class Peer {
  constructor() {
    this.peers = new Set(); // Store connected peers (WebSocket objects)
    this.peerIPs = new Set(); // Store unique peer IPs to prevent duplicates
    this.server = null;
  }

  // Start the peer and listen for incoming connections
  start(port) {
    this.server = new WebSocket.Server({ port }, () => {
      console.log(`Peer started on ws://localhost:${port}`);
    });

    this.server.on('connection', (ws) => {
      const peerIP = ws._socket.remoteAddress; // Get peer's IP address

      // Check if the peer IP is already in the peerIPs set
      if (this.peerIPs.has(peerIP)) {
        console.log(`Peer with IP ${peerIP} is already connected. Disconnecting.`);
        ws.close(); // Close the connection to prevent duplicate
        return;
      }

      console.log('New peer connected');
      
      // Add the WebSocket connection and the peer's IP to the sets
      this.peers.add(ws);
      this.peerIPs.add(peerIP);

      // Send the current list of peers to the newly connected peer
      this.sendPeerList();

      // Handle incoming messages from peers
      ws.on('message', (message) => {
        const data = JSON.parse(message);
        if (data.type === 'join') {
          this.handlePeerJoin(ws);
        }
      });

      // Clean up on peer disconnect
      ws.on('close', () => {
        this.peers.delete(ws); // Remove WebSocket from the set
        this.peerIPs.delete(peerIP); // Remove peer IP from the set
        this.sendPeerList(); // Send the updated list of peers to others
      });
    });
  }

  // Broadcast the list of connected peers to all peers
  sendPeerList() {
    const peerList = [...this.peers].map((peer, index) => {
      // Use the WebSocket remote address or port to create a unique identifier
      return `Peer ${index + 1} - ${peer._socket.remoteAddress}:${peer._socket.remotePort}`;
    });

    // Send the peer list to all connected peers
    this.peers.forEach((peer) => {
      peer.send(JSON.stringify({ type: 'peer_update', peers: peerList }));
    });
  }

  // Handle a new peer joining the network
  handlePeerJoin(ws) {
    console.log('Peer joined the network');
    this.sendPeerList(); // Send the updated list of peers to everyone
  }
}

// Initialize the peer and start the WebSocket server
const myPeer = new Peer();
myPeer.start(5000);