"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashValidado = exports.hash = void 0;
const crypto_1 = require("crypto");
function hash(dado) {
    return (0, crypto_1.createHash)('sha256').update(dado).digest('hex');
}
exports.hash = hash;
function hashValidado({ hash, dificuldade = 4, prefixo = '0' }) {
    const check = prefixo.repeat(dificuldade);
    return hash.startsWith(check);
}
exports.hashValidado = hashValidado;
