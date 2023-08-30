"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Blockchain = void 0;
const helpers_1 = require("./helpers");
class Blockchain {
    dificuldade;
    #chain = [];
    prefixoPow = '0';
    constructor(dificuldade = 4) {
        this.dificuldade = dificuldade;
        this.#chain.push(this.criarBlocoGenesis());
    }
    criarBlocoGenesis() {
        const payload = {
            sequencia: 0,
            timestamp: +new Date(),
            dados: 'Bloco Inicial',
            hashAnterior: ''
        };
        return {
            header: {
                nonce: 0,
                hashBloco: (0, helpers_1.hash)(JSON.stringify(payload))
            },
            payload
        };
    }
    get ultimoBloco() {
        return this.#chain.at(-1);
    }
    get chain() {
        return this.#chain;
    }
    hashUltimoBloco() {
        return this.ultimoBloco.header.hashBloco;
    }
    criarBloco(dados) {
        const novoBloco = {
            sequencia: this.ultimoBloco.payload.sequencia + 1,
            timestamp: +new Date(),
            dados,
            hashAnterior: this.hashUltimoBloco()
        };
        console.log(`Bloco #${novoBloco.sequencia}: ${JSON.stringify(novoBloco, null, 2)}`);
        return novoBloco;
    }
    minerarBloco(bloco) {
        let nonce = 0;
        const inicio = +new Date();
        while (true) {
            const hashBloco = (0, helpers_1.hash)(JSON.stringify(bloco));
            const hashPoW = (0, helpers_1.hash)(hashBloco + nonce);
            if ((0, helpers_1.hashValidado)({
                hash: hashPoW,
                dificuldade: this.dificuldade,
                prefixo: this.prefixoPow
            })) {
                const final = +new Date();
                const hashReduzido = hashBloco.slice(0, 12);
                const tempoMineracao = (final - inicio) / 1000;
                console.log(`Bloco #${bloco.sequencia} minerado em ${tempoMineracao}s.
          Hash ${hashReduzido} (${nonce} tentativas)`);
                return {
                    blocoMinerado: { payload: { ...bloco }, header: { nonce, hashBloco } },
                    hashMinerado: hashPoW,
                    hashReduzido,
                    tempoMineracao
                };
            }
            nonce++;
        }
    }
    verificarBloco(bloco) {
        if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
            console.error(`Bloco #${bloco.payload.sequencia} inválido:
        O hash anterior é ${this.hashUltimoBloco().slice(0, 12)} e não
        ${bloco.payload.hashAnterior.slice(0, 12)}`);
            return;
        }
        const hashTeste = (0, helpers_1.hash)((0, helpers_1.hash)(JSON.stringify(bloco.payload)) + bloco.header.nonce);
        if (!(0, helpers_1.hashValidado)({
            hash: hashTeste,
            dificuldade: this.dificuldade,
            prefixo: this.prefixoPow
        })) {
            console.error(`Bloco #${bloco.payload.sequencia} inválido:
        Nonce ${bloco.header.nonce} é invalido e não pode ser verificado
      `);
            return;
        }
        return true;
    }
    enviarBloco(bloco) {
        if (this.verificarBloco(bloco)) {
            this.#chain.push(bloco);
            console.log(`Bloco #${bloco.payload.sequencia} foi adicionado a blockchain:
      ${JSON.stringify(bloco, null, 2)}`);
        }
        return this.#chain;
    }
}
exports.Blockchain = Blockchain;
