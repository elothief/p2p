const crypto = require('crypto');

class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;  // Used in proof-of-work
    }

    calculateHash() {
        return crypto.createHash('sha256')
                     .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
                     .digest('hex');
      }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

module.exports = Block;
