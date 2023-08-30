"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const blockchain_1 = require("./blockchain");
const blockchain = new blockchain_1.Blockchain(Number(process.argv[2] || 4));
const numBlocos = +process.argv[3] || 10;
let chain = blockchain.chain;
for (let i = 1; i <= numBlocos; i++) {
    const bloco = blockchain.criarBloco(`Bloco ${i}`);
    const mineINfo = blockchain.minerarBloco(bloco);
    chain = blockchain.enviarBloco(mineINfo.blocoMinerado);
}
console.log('—— Blockchain ——');
console.log(chain);
