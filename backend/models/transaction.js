class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }

    signTransaction(privateKey) {
        const txData = this.getTransactionData();
        this.signature = secp256k1.sign(txData, privateKey).signature;
      }
      
      getTransactionData() {
        return this.fromAddress + this.toAddress + this.amount;
      }
      
}

module.exports = Transaction;
