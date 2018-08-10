const general = {
  success: 'Sucesso',
  warning: 'Atenção',
  cancel: 'Cancelar',
  ok: 'OK',
  error: {
    default: 'Oops, Algo deu errado. Tente novamente mais tarde, se o erro persistir tente atualizar as configurações de rede.',
    buildingTransaction: 'Erro ao montar a transação, tente novamente.',
    gettingTransaction: 'Erro ao buscar a transação.',
    clipboardCopied: 'Algo deu errado ao copiar.'
  },
  tronPower: 'FORÇA TRON',
  trxPrice: 'PREÇO DO TRX',
  confirmed: 'Confirmado',
  unconfirmed: 'Não Confirmado',
  transactionType: {
    transfer: 'Transferência',
    transferAsset: 'Transferência de Ativo',
    freeze: 'Congelamento',
    unfreeze: 'Descongelamento',
    vote: 'Voto',
    participate: 'Participação',
    create: 'Criação',
    undefined: 'Tipo Indefinido'
  },
  ends: 'Termina',
  clear: 'Limpar',
  allIn: 'Apostar Tudo'
}

const balance = {
  title: 'SALDO',
  error: {
    loadingData: 'Ocorreu um erro ao carregar os dados.',
    savingCurrency: 'Erro ao salvar a moeda preferida'
  },
  chooseCurrency: 'Por favor, escolha sua moeda preferida',
  confirmSeed: 'Por favor, toque para confirmar suas 12 palavras',
  bandwidth: 'LARGURA DE BANDA',
  tokens: 'MOEDAS',
  holdings: 'POSSES'
}

const components = {
  share: {
    title: 'Compartilhar endereço TronWallet',
    message: `Esse é meu endereço TronWallet:\n\n {{address}}\n\nDica: Depois de copiar você pode colar no seu app TronWallet usando o botão especial na tela de Envio.`,
    dialogTitle: 'Compartilhar usando:'
  },
  QRScanner: {
    title: 'Scanner de Endereço',
    explanation: 'Escaneie o QRCode para identificar o usuário alvo',
    permissionMessage: 'Para escanear a chave pública o app precisa da sua permissão para acessar a camera'
  },
  vote: {
    enterVote: 'ENTRE COM O VALOR DO VOTO',
    votesRemaining: 'VOTOS RESTANTES',
    setVote: 'VOTAR',
    moreVotes: 'Se você precisar de mais votos você pode Congelar mais TRX.',
    confirmVotes: 'CONFIRMAR VOTOS',
    yourVotes: 'Seus Votos',
    myVotes: 'MEUS VOTOS',
    confirm: 'CONFIRMAR',
    freeze: 'Congelar',
    totalVotes: 'Total de votos disponíveis:',
    delete: 'EXCLUIR',
    set: 'ADICIONAR',
    freezeOrLower: 'Você não tem TRX congelado suficiente. Congele mais TRX ou diminua a quantidade de votos.',
    freezeToContinue: 'Você não tem TRX congelado suficiente. Congele mais TRX para continuar.'
  }
}

const firstTime = {
  button: {
    create: 'CRIAR CARTEIRA',
    restore: 'RESTAURAR CARTEIRA'
  }
}

const freeze = {
  title: 'CONGELAR',
  unfreeze: {
    title: 'DESCONGELAR',
    inThreeDays: 'Depois de três dias você poderá descongelar seu TRX',
    inXMinutes: 'Você poderá descongelar seu TRX em {{minutes}} minutos.',
    inXHours: 'Você poderá descongelar seu TRX em {{hours}} horas.',
    inXDays: 'Você poderá descongelar seu TRX em {{days}} dias.',
    now: 'Você pode descongelar seu TRX agora.'
  },
  error: {
    minimumAmount: 'A quantidade mínima para uma transação de congelamento é 1.',
    insufficientBalance: 'Saldo de TRX insuficiente',
    roundNumbers: 'Você só pode congelar números redondos'
  },
  amount: 'QUANTIA CONGELADA',
  balance: 'Saldo'
}

const getVault = {
  notInstalled: `Parece que você não tem o Tron Vault instalado no seu dispositivo para proceder com essa transação.`,
  downloadHere: 'Você pode baixá-lo aqui'
}

const market = {
  time: {
    hour: '1H',
    day: '1D',
    week: '1S',
    month: '1M',
    all: 'TUDO'
  },
  highest: 'MAIOR',
  lowest: 'MENOR',
  volume: 'VOLUME 24H',
  cap: 'VALOR DE MERCADO',
  supply: 'MOEDAS EM CIRCULAÇÃO'
}

const participate = {
  title: 'PARTICIPAÇÃO',
  featured: 'DESTAQUE',
  button: {
    confirm: 'CONFIRMAR',
    moreInfo: 'MAIS INFORMAÇÃO',
    buyNow: 'COMPRAR AGORA'
  },
  error: {
    insufficientBalance: 'Saldo insuficiente (TRX) para participar.',
    insufficientTrx: {
      title: 'Você precisa comprar ao menos um TRX em {{token}}.',
      message: 'Atualmente você está comprando {{amount}}.'
    }
  },
  warning: `Você não tem TRX suficiente para comprar tantos {{token}}.`,
  amountToBuy: 'QUANTIA PARA COMPRAR',
  pricePerToken: 'PREÇO POR MOEDA',
  tokenDescription: 'DESCRIÇÃO DA MOEDA',
  tokenInfo: 'INFORMAÇÃO DA MOEDA',
  token: 'MOEDA',
  tokens: 'MOEDAS',
  frozen: 'CONGELADO',
  percentage: 'PORCENTAGEM',
  issued: 'EMITIDO',
  totalSupply: 'OFERTA TOTAL',
  startTime: 'INÍCIO',
  endTime: 'FIM',
  description: 'DESCRIÇÃO',
  transaction: 'TRANSAÇÃO',
  ownerAddress: 'ENDEREÇO DO DONO',
  trxNum: 'TRX NUM',
  num: 'NUM',
  block: 'BLOCO'
}

const pin = {
  title: 'VERIFICAÇÃO DE SEGURANÇA',
  enter: 'Coloque o PIN',
  reenter: 'Redigite o PIN'
}

const receive = {
  title: 'RECEBER',
  clipboardCopied: 'Copiado para área de transferência',
  button: {
    copy: 'Copiar',
    share: 'Compartilhar'
  }
}

const rewards = {
  title: 'RECOMPENSAS',
  earned: 'Você recebeu'
}

const seed = {
  confirm: {
    title: 'CONFIRMAR SEED',
    error: {
      title: 'Combinação Errada',
      message: `Palavras selecionadas não correspondem. Certifique-se de que escreveu as palavras na ordem correta.`
    },
    success: 'Carteira confirmada com sucesso',
    explanation: 'Selecione as palavras abaixo na ordem correta para confirmar sua frase secreta.',
    button: {
      reset: 'RESETAR PALAVRAS',
      confirm: 'CONFIRMAR SEED'
    }
  },
  create: {
    title: 'CONFIRMAR SEED DA CARTEIRA',
    error: 'Oops, nós temos um problema. Por favor reinicie a aplicação.',
    generateNew: 'Isso irá gerar uma carteira completamente nova.',
    button: {
      written: `EU ANOTEI`,
      newSeed: 'OBTER NOVO SEED',
      later: 'Confirmar depois'
    }
  },
  restore: {
    title: 'RESTAURAR CARTEIRA',
    explanation: `Para restaura sua carteira, por favor forneça as mesmas 12 palavras que você anotou no papel quando criou sua carteira pela primeira vez. Se você entrar com uma sequência diferente de palavras, uma nova carteira vazia será criada.`,
    placeholder: 'Por favor, digite suas 12 palavras aqui',
    success: 'Carteira restaurada com sucesso!',
    warning: 'Restaurar o seed vai apagar todos os dados neste dispositivo e puxar informações da rede para a conta restaurada.',
    error: `Oops. Parece que as palavras digitas não são um mnemônico válido. Verifique por um erro de digitação e tente novamente.`,
    button: 'RESTAURAR'
  }
}

const send = {
  title: 'ENVIAR',
  error: {
    insufficientBalance: 'Saldo insuficiente.',
    gettingBalance: 'Erro ao buscar saldo',
    incompleteAddress: 'Endereço incompleto ou inválido.',
    invalidReceiver: 'Endereço do receptor inválido',
    selectBalance: 'Selecione um saldo primeiro',
    invalidAmount: 'Quantia inválida'
  },
  input: {
    token: 'MOEDA',
    to: 'PARA',
    amount: 'QUANTIA'
  },
  available: 'disponível',
  chooseToken: 'Por favor, escolha um moeda abaixo.',
  minimumAmount: 'A quantia mínima para qualquer transação de envio é de 0.000001.'
}

const settings = {
  title: 'CONFIGURAÇÕES',
  notifications: {
    title: 'Assinatura de Notificações',
    description: 'Habilita ou desabilita recebimento de notificações'
  },
  network: {
    title: 'Rede',
    description: 'Escolha um nó de sua preferência',
    modal: {
      title: 'REDE',
      explanation: 'Com essa opção você pode selecionar o nó que melhor atender duas expectativas e necessidades. Por favor, seja cuidadoso ao atualizar o IP do nó, uma vez que o IP errado pode trazer malfuncionamentos para sua carteira. Exemplo: 35.231.121.122:50051',
      error: {
        storage: 'Erro ao buscar ip do nó no armazenamento local',
        invalidIp: 'Favor entrar com um IP válido',
        update: 'Algo deu errado ao atualizar o ip dos nós',
        reset: 'Algo deu errado ao resetar o ip do nó'
      },
      success: {
        updated: 'Atualizado',
        updatedIp: 'IP dos nós atualizado!',
        switchTest: 'IP dos nós alterado para TestNet',
        switchMain: 'IP dos nós alterado para rede principal padrão',
        reset: 'IP do nó resetado!'
      },
      placeholder: {
        loadingIp: 'Carregando IP',
        loadingPort: 'Carregando Porta'
      },
      button: {
        update: 'Atualizar e Conectar',
        reset: 'Resetar'
      },
      mainNode: 'Nó Principal',
      solidityNode: 'Nó de Solidez',
      testNet: 'TestNet'
    }
  },
  backup: {
    title: 'Backup de Carteira',
    description: 'Faça uma cópia de segurança para suas palavras secretas'
  },
  restore: {
    title: 'Restaurar Carteira',
    description: 'Restaurar as 12 palavras secretas usadas anteriormente'
  },
  reset: {
    title: 'Resetar Carteira',
    description: 'Reinicia todos os dado da carteira atual',
    warning: `Atenção: Essa ação irá apagar todos os dados salvos, incluindo suas 12 palavras secretas. Se você não anotou seu segredo, por favor faça antes de continuar.`,
    button: 'OK, eu entendo'
  },
  language: {
    title: 'Mudar Idioma',
    description: 'Muda o idioma do aplicativo',
    choose: 'Por favor, escolha um Idioma abaixo:',
    success: 'Idioma alterado para {{language}}, por favor reinicie o app',
    error: 'Erro ao salvar Idioma'
  },
  partners: 'PARCEIROS'
}

const submitTransaction = {
  title: 'DETALHES DA TRANSAÇÃO',
  notification: 'Você recebeu uma transação de {{address}}',
  button: {
    tryAgain: 'Tentar novamente',
    submit: 'ENVIAR TRANSAÇÃO'
  },
  disconnectedMessage: 'Parece que você está desconectado. Reconecte-se à internet antes de proceder com essa transação.',
  dic: {
    contractType: 'Tipo de Transação',
    ownerAddress: 'De',
    toAddress: 'Para',
    participateAssetIssueContract: 'Participação',
    transferAssetContract: 'Transferência',
    transferContract: 'Transferência',
    unfreezeBalanceContract: 'Descongelamento',
    freezeBalanceContract: 'Congelamento',
    assetIssueContract: 'Criação',
    voteWitnessContract: 'Voto',
    frozenDuration: 'Duração',
    frozenBalance: 'Total para Congelar'
  },
  errorDic: {
    contractValidate: 'Dados da transação inválidos. Favor tentar novamente mais tarde.',
    signature: 'Assinatura da transação inválida.',
    duplicate: 'Transação já enviada.',
    contractValidateCee: 'Dados da transação inválidos (CEE). Favor tentar novamente mais tarde.',
    bandwith: 'Largura de Banda insuficiente. Favor tentar novamente mais tarde.',
    contractValidateTapos: 'Dados da transação inválidos (TAPOS). Favor tentar novamente mais tarde.',
    tooBig: 'Transação grande demais para ser enviada.',
    expiration: 'Transação expirada. Favor tentar novamente.',
    serverBusy: 'Servidor ocupado.'
  },
  totalVotes: 'Total de Votos'
}

const transactions = {
  title: 'MINHAS TRANSAÇÕES',
  from: 'De',
  to: 'Para',
  notFound: 'Nenhum transação encontrada.'
}

const transactionDetails = {
  title: 'TRANSAÇÃO',
  clipboard: {
    tronscanUrl: 'Url do Tronscan para essa transação copiada para área de transferência',
    publicKey: 'Chave Pública copiada para área de transferência'
  },
  hash: 'HASH',
  status: 'ESTADO',
  time: 'HORA',
  block: 'BLOCO',
  frozenBalance: 'SALDO CONGELADO',
  unfrozenBalance: 'SALDO DESCONGELADO',
  totalVotes: 'TOTAL DE VOTOS',
  amount: 'QUANTIA',
  to: 'PARA',
  from: 'DE',
  tokenName: 'NOME DA MOEDA',
  unityValue: 'VALOR UNITÁRIO',
  totalSupply: 'OFERTA TOTAL',
  startTime: 'INÍCIO',
  endTime: 'FIM',
  description: 'DESCRIÇÃO',
  votedAddress: 'ENDEREÇO VOTADO'
}

const transactionSuccess = {
  submitted: 'TRANSAÇÃO ENVIADA PARA REDE!',
  success: 'SUCESSO!'
}

const votes = {
  title: 'VOTOS',
  totalVotes: 'TOTAL DE VOTOS',
  votesAvailable: 'VOTOS DISPONÍVEIS',
  search: 'Buscar',
  error: `Oops, algo não carregou corretamente. Tente recarregar.`
}

export default {
  balance,
  components,
  firstTime,
  freeze,
  getVault,
  market,
  participate,
  pin,
  receive,
  rewards,
  seed,
  send,
  settings,
  submitTransaction,
  transactions,
  transactionDetails,
  transactionSuccess,
  votes,
  ...general
}
