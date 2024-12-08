const secp256k1 = require('secp256k1');
const crypto = require('crypto');

class Wallet {
    constructor(privateKey) {
        // If no private key is provided, generate one
        if (privateKey) {
            if (privateKey.length !== 64) {
                throw new Error('Invalid private key length');
            }
            this.privateKey = Buffer.from(privateKey, 'hex');
        } else {
            this.privateKey = this.generatePrivateKey();
        }

        this.publicKey = this.generatePublicKey();
    }

    // Generate a random private key using crypto
    generatePrivateKey() {
        let privateKey;
        do {
            privateKey = crypto.randomBytes(32); // Generate 32-byte private key
        } while (!secp256k1.privateKeyVerify(privateKey)); // Ensure it's valid
        return privateKey;
    }

    // Generate the corresponding public key from the private key
    generatePublicKey() {
        const publicKey = secp256k1.publicKeyCreate(this.privateKey);
        return publicKey.toString('hex');
    }

    // Set the private key manually (if needed)
    setPrivateKey(privateKey) {
        if (privateKey.length !== 64) {
            throw new Error('Invalid private key length');
        }
        this.privateKey = Buffer.from(privateKey, 'hex');
        this.publicKey = this.generatePublicKey(); // Recalculate public key if private key is set manually
    }

    // Generate a transaction from this wallet
    createTransaction(toAddress, amount) {
        return {
            fromAddress: this.publicKey,
            toAddress,
            amount,
            timestamp: Date.now(),
        };
    }
}

module.exports = Wallet;
