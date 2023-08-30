import { hash, hashValidado } from './helpers'

export interface Bloco {
  header: {
    nonce: number
    hashBloco: string
  }
  payload: {
    sequencia: number
    timestamp: number
    dados: any
    hashAnterior: string
  }
}

export class Blockchain {
  #chain: Bloco[] = []
  private prefixoPow = '0'

  constructor(private readonly dificuldade: number = 4) {
    this.#chain.push(this.criarBlocoGenesis())
  }

  private criarBlocoGenesis() {
    const payload = {
      sequencia: 0,
      timestamp: +new Date(),
      dados: 'Bloco Inicial',
      hashAnterior: ''
    }

    return {
      header: {
        nonce: 0,
        hashBloco: hash(JSON.stringify(payload))
      },
      payload
    }
  }

  private get ultimoBloco(): Bloco {
    return this.#chain.at(-1) as Bloco
  }

  get chain() {
    return this.#chain
  }

  private hashUltimoBloco() {
    return this.ultimoBloco.header.hashBloco
  }

  criarBloco(dados: any) {
    const novoBloco = {
      sequencia: this.ultimoBloco.payload.sequencia + 1,
      timestamp: +new Date(),
      dados,
      hashAnterior: this.hashUltimoBloco()
    }
    console.log(`Bloco #${novoBloco.sequencia}: ${JSON.stringify(novoBloco, null, 2)}`)
    return novoBloco
  }

  minerarBloco(bloco: Bloco['payload']) {
    let nonce = 0
    const inicio = +new Date()

    while (true) {
      const hashBloco = hash(JSON.stringify(bloco))
      const hashPoW = hash(hashBloco + nonce)

      if (hashValidado({
        hash: hashPoW,
        dificuldade: this.dificuldade,
        prefixo: this.prefixoPow
      })) {
        const final = +new Date()
        const hashReduzido = hashBloco.slice(0, 12)
        const tempoMineracao = (final - inicio) / 1000

        console.log(`Bloco #${bloco.sequencia} minerado em ${tempoMineracao}s.
          Hash ${hashReduzido} (${nonce} tentativas)`)

        return {
          blocoMinerado: { payload: { ...bloco }, header: { nonce, hashBloco } },
          hashMinerado: hashPoW,
          hashReduzido,
          tempoMineracao
        }
      }
      nonce++
    }
  }

  verificarBloco(bloco: Bloco) {
    if (bloco.payload.hashAnterior !== this.hashUltimoBloco()) {
      console.error(`Bloco #${bloco.payload.sequencia} inválido:
        O hash anterior é ${this.hashUltimoBloco().slice(0, 12)} e não
        ${bloco.payload.hashAnterior.slice(0, 12)}`)
      return
    }

    const hashTeste = hash(hash(JSON.stringify(bloco.payload)) + bloco.header.nonce)
    if (!hashValidado({
      hash: hashTeste,
      dificuldade: this.dificuldade,
      prefixo: this.prefixoPow
    })) {
      console.error(`Bloco #${bloco.payload.sequencia} inválido:
        Nonce ${bloco.header.nonce} é invalido e não pode ser verificado
      `)
      return
    }

    return true
  }

  enviarBloco(bloco: Bloco) {
    if (this.verificarBloco(bloco)) {
      this.#chain.push(bloco)
      console.log(`Bloco #${bloco.payload.sequencia} foi adicionado a blockchain:
      ${JSON.stringify(bloco, null, 2)}`)
    }
    return this.#chain
  }
}

