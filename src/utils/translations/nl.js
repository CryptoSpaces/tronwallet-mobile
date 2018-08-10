const general = {
  success: 'Gelukt',
  warning: 'Waarschuwing',
  cancel: 'Annuleer',
  ok: 'OK',
  error: {
    default: 'Oeps er is iets fout gegaan. Probeer opnieuw. Als de foutmelding niet verdwijnt, probeer dan je netwerkinstellingen aan te passen.',
    buildingTransaction: 'Fout tijdens bouwen van de transactie, probeer opnieuw.',
    gettingTransaction: 'Fout tijdens ophalen van de transactie.',
    clipboardCopied: 'Fout tijdens kopiëren naar klembord.'
  },
  tronPower: 'TRON POWER',
  trxPrice: 'TRX PRIJS',
  confirmed: 'Bevestigd',
  unconfirmed: 'Onbevestigd',
  transactionType: {
    transfer: 'Transfer',
    transferAsset: 'Transfer Asset',
    freeze: 'Zet vast',
    unfreeze: 'Neem op',
    vote: 'Stem',
    participate: 'Neem deel',
    create: 'Maak',
    undefined: 'Onbekend Type'
  },
  ends: 'Eindigt',
  clear: 'Wissen',
  allIn: 'Alles'
}

const balance = {
  title: 'BALANS',
  error: {
    loadingData: 'Fout tijdens laden van gegevens.',
    savingCurrency: 'Fout tijdens opslaan voorkeur voor munteenheid.'
  },
  chooseCurrency: 'Kies je voorkeurs munteenheid.',
  confirmSeed: 'Druk om je 12 seed woorden te bevestigen',
  bandwidth: 'BANDBREEDTE',
  tokens: 'TOKENS',
  holdings: 'BEZITTINGEN'
}

const components = {
  share: {
    title: 'Deel TronWallet adres',
    message: `Dit is mijn TronWallet adres:\n\n {{address}}\n\nTip: Als je dit adres kopieert kun je het in TronWallet plakken door in het Verstuur scherm de speciale knop te gebruiken.`,
    dialogTitle: 'Deel via:'
  },
  QRScanner: {
    title: 'Adres Scanner',
    explanation: 'Scan de QRCode om de doelgebruiker te identificeren',
    permissionMessage: 'Om de publieke sleutel te scannen heeft de app toestemming nodig om je camera te mogen gebruiken.'
  },
  vote: {
    enterVote: 'VOER STEM AANTAL IN',
    votesRemaining: 'STEMMEN OVER',
    setVote: 'STEM',
    moreVotes: 'Als je meer stemmen nodig hebt kun je meer TRX vastzetten.',
    confirmVotes: 'BEVESTIG STEMMEN',
    yourVotes: 'Jouw Stemmen',
    myVotes: 'MIJN STEMMEN',
    confirm: 'BEVESTIG',
    freeze: 'ZET VAST',
    totalVotes: 'Totaal beschikbare stemmen:',
    delete: 'VERWIJDER',
    set: 'STEM',
    freezeOrLower: 'Je hebt niet voldoende TRX vastgezet. Zet meer TRX vast of verlaag het aantal stemmen',
    freezeToContinue: 'Je hebt niet voldoende TRX vastgezet. Zet meer TRX vast om door te kunnen gaan'
  }
}

const firstTime = {
  button: {
    create: 'MAAK PORTEMONNEE',
    restore: 'HERSTEL PORTEMONNEE'
  }
}

const freeze = {
  title: 'ZET VAST',
  unfreeze: {
    title: 'VRIJGEVEN',
    inThreeDays: 'Na drie dagen kun je je TRX weer opnemen.',
    inXMinutes: 'Je kunt je TRX over {{minutes}} minuten opnemen.',
    inXHours: 'Je kunt je TRX over {{hours}} uur opnemen.',
    inXDays: 'Je kunt je TRX over {{days}} dag(en) opnemen.',
    now: 'Je kunt je TRX nu opnemen.'
  },
  error: {
    minimumAmount: 'De minimale hoeveelheid om vast te zetten is 1',
    insufficientBalance: 'TRX balans ontoereikend',
    roundNumbers: 'Je kunt alleen hele bedragen vastzetten'
  },
  amount: 'HOEVEEL VASTZETTEN',
  balance: 'Balans'
}

const getVault = {
  notInstalled: `Het lijkt erop dat je Tron Vault niet hebt geïnstalleerd op je telefoon. Om door te gaan met je transactie`,
  downloadHere: 'kun je deze hier downloaden'
}

const market = {
  time: {
    hour: '1U',
    day: '1D',
    week: '1W',
    month: '1M',
    all: 'ALLES'
  },
  highest: 'HOOGSTE',
  lowest: 'LAAGSTE',
  volume: 'VOLUME 24U',
  cap: 'MARKTKAPITALISATIE',
  supply: 'TOTAAL IN OMLOOP'
}

const participate = {
  title: 'NEEM DEEL',
  featured: 'UITGELICHT',
  button: {
    confirm: 'BEVESTIG',
    moreInfo: 'MEER INFORMATIE',
    buyNow: 'KOOP NU'
  },
  error: {
    insufficientBalance: 'Onvoldoende middelen (TRX) om deel te nemen.',
    insufficientTrx: {
      title: 'Je moet minstens één TRX aan {{token}} kopen.',
      message: 'Momenteel koop je slechts {{amount}}.'
    }
  },
  warning: `Je hebt onvoldoende TRX om zoveel {{token}} te kopen.`,
  amountToBuy: 'TE KOPEN HOEVEELHEID',
  pricePerToken: 'PRIJS PER TOKEN',
  tokenDescription: 'TOKEN OMSCHRIJVING',
  tokenInfo: 'TOKEN INFO',
  token: 'TOKEN',
  tokens: 'TOKENS',
  frozen: 'VAST GEZET',
  percentage: 'PERCENTAGE',
  issued: 'UITGEGEVEN',
  totalSupply: 'TOTALE HOEVEELHEID',
  startTime: 'START TIJD',
  endTime: 'EIND TIME',
  description: 'OMSCHRIJVING',
  transaction: 'TRANSACTIE',
  ownerAddress: 'ADRES EIGENAAR',
  trxNum: 'TRX HOEVEELHEID',
  num: 'NUM',
  block: 'BLOCK'
}

const pin = {
  title: 'VEILIGHEIDSCHECK',
  enter: 'Voer PIN in',
  reenter: 'Herhaal PIN'
}

const receive = {
  title: 'ONTVANG',
  clipboardCopied: 'Naar klembord gekopieerd',
  button: {
    copy: 'Kopieer',
    share: 'Deel'
  }
}

const rewards = {
  title: 'Beloningen',
  earned: 'Je bent beloont met'
}

const seed = {
  confirm: {
    title: 'BEVESTIG SEED',
    error: {
      title: 'Verkeerde Combinatie',
      message: `Geselecteerde woorden komen niet overeen. Zorg ervoor dat je de woorden in de juiste volgorde hebt geschreven.`
    },
    success: 'Portemonnee succesvol bevestigd',
    explanation: 'Select the words below in the right order to confirm your secret phrase.',
    button: {
      reset: 'WOORDEN WISSEN',
      confirm: 'BEVESTIG SEED'
    }
  },
  create: {
    title: 'BEVESTIG PORTEMONNEE SEED',
    error: 'Oeps, we hebben een probleempje. Start de app alsjeblieft opnieuw.',
    generateNew: 'Dit zal een volledig nieuwe portemonnee aanmaken.',
    button: {
      written: `IK HEB HET OPGESCHREVEN`,
      newSeed: 'NIEUWE SEED',
      later: 'Bevestig later'
    }
  },
  restore: {
    title: 'HERSTEL PORTEMONNEE',
    explanation: `Om je portemonnee te herstellen, please provide the same 12 words that you wrote on paper when you created your wallet for the first time. If you enter a different sequence of words, a new empty wallet will be created.`,
    placeholder: 'Please, type your 12 seed words here',
    success: 'Portemonnee met succes herstelt!',
    warning: 'Het herstellen van de seed zal alle gegevens op dit toestel wissen en nieuwe informatie uit het netwerk ophalen om je account te herstellen.',
    error: `Oeps. Het lijkt erop dat de woorden die je hebt ingevoerd geen geldige mnemonic seed vormen. Controleer op fouten en probeer het opnieuw.`,
    button: 'HERSTEL'
  }
}

const send = {
  title: 'VERSTUUR',
  error: {
    insufficientBalance: 'Balans ontoereikend.',
    gettingBalance: 'Fout tijdens ophalen balans gegevens.',
    incompleteAddress: 'Adres is ongeldig of onvolledig.',
    invalidReceiver: 'Adres ontvanger is ongeldig',
    selectBalance: 'Selecteer eerst een balans.',
    invalidAmount: 'Ongeldige hoeveelheid'
  },
  input: {
    token: 'TOKEN',
    to: 'NAAR',
    amount: 'HOEVEELHEID'
  },
  available: 'beschikbaar',
  chooseToken: 'Selecteer een token, alsjeblieft.',
  minimumAmount: 'De minimale hoeveelheid voor elke verzend transactie is 0.000001.'
}

const settings = {
  title: 'INSTELLINGEN',
  notifications: {
    title: 'Notificatie instellingen',
    description: 'Zet push notificaties aan of uit'
  },
  network: {
    title: 'Netwerk',
    description: 'Kies een voorkeurs node',
    modal: {
      title: 'NETWERK',
      explanation: 'Met deze instelling kun je een node kiezen die beter bij jouw wensen en behoeftes past. Bijvoorbeeld: 35.231.121.122:50051. Pas wel op met het aanpassen van de node ip omdat een verkeerde node voor een slecht werkende app kan zorgen en/of verlies van je munten!',
      error: {
        storage: 'Fout tijdens ophalen van node adressen uit lokale opslag',
        invalidIp: 'Voer een geldig IP adres in',
        update: 'Er is iets fout gegaan tijdens het updaten van de node adressen',
        reset: 'Er is iets fout gegaan tijdens het reseten van de node adressen'
      },
      success: {
        updated: 'Aangepast',
        updatedIp: 'Adressen van nodes aangepast!',
        switchTest: 'Adressen van nodes gewisseld naar Testnet',
        switchMain: 'Adressen van nodes gewisseld naar standaard Main',
        reset: 'Adressen van nodes gereset!'
      },
      placeholder: {
        loadingIp: 'IP laden',
        loadingPort: 'Poort laden'
      },
      button: {
        update: 'Aanpassen en Verbinden',
        reset: 'Herstellen'
      },
      mainNode: 'Main Node',
      solidityNode: 'Solidity Node',
      testNet: 'TestNet'
    }
  },
  backup: {
    title: 'Portemonnee back-uppen',
    description: 'Maak een backup van je seed woorden'
  },
  restore: {
    title: 'Portemonnee Herstellen',
    description: 'Herstel portemonnee met behulp van je 12 woorden seed'
  },
  reset: {
    title: 'Portemonnee wissen',
    description: 'Wis alle gegevens van de huidige portemonnee',
    warning: `Waarschuwing: Dit zal alle opgeslagen gegevens wissen, inclusief je 12 woorden seed. Als je je seed niet hebt opgeslagen, doe dat dan alsjeblieft voordat je verder gaat.`,
    button: 'OK, ik heb het begrepen'
  },
  language: {
    title: 'Pas taal aan',
    description: 'Pas de taal van de app aan',
    choose: 'Kies een taal:',
    sucess: 'Taal aangepast naar {{language}}. Start de app opnieuw, alsjeblieft.',
    error: 'Fout tijdens opslaan van voorkeurs taal'
  },
  partners: 'PARTNERS'
}

const submitTransaction = {
  title: 'TRANSACTIE DETAILS',
  notification: 'Je hebt een transactie van {{address}} ontvangen',
  button: {
    tryAgain: 'Probeer opnieuw',
    submit: 'VERSTUUR TRANSACTIE'
  },
  disconnectedMessage: 'Het lijkt erop dat je geen internetverbinding hebt. Maak verbinding met het internet voordat je verder gaat met deze transactie.',
  dic: {
    fronzeBalance: 'Frozen Balance',
    contractType: 'Transaction Type',
    ownerAddress: 'From',
    toAddress: 'To',
    participateAssetIssueContract: 'Participate',
    transferAssetContract: 'Transfer',
    transferContract: 'Transfer',
    unfreezeBalanceContract: 'Unfreeze',
    freezeBalanceContract: 'Freeze',
    assetIssueContract: 'Create',
    voteWitnessContract: 'Vote',
    frozenDuration: 'Duration',
    frozenBalance: 'Total to Freeze'
  },
  errorDic: {
    contractValidate: 'Transaction data not valid. Please try again later.',
    signature: 'Transaction signature not valid.',
    duplicate: 'Transaction already broadcasted.',
    contractValidateCee: 'Transaction data not valid (CEE). Please try again later.',
    bandwith: 'Not enought bandwidth. Please try again later.',
    contractValidateTapos: 'Transaction data not valid (TAPOS). Please try again later.',
    tooBig: 'Transaction too big to be submitted.',
    expiration: 'Transaction expired. Please try again.',
    serverBusy: 'Server busy.'
  },
  totalVotes: 'Total Votes'
}

const transactions = {
  title: 'MIJN TRANSACTIES',
  from: 'Van',
  to: 'Naar',
  notFound: 'Geen transacties gevonden.'
}

const transactionDetails = {
  title: 'TRANSACTIE',
  clipboard: {
    tronscanUrl: 'Tronscan url voor deze transactie is naar het klembord gekopieerd',
    publicKey: 'Publieke sleutel is naar het klembord gekopieerd'
  },
  hash: 'HASH',
  status: 'STATUS',
  time: 'TIJD',
  block: 'BLOK',
  frozenBalance: 'VASTGEZETTE BALANS',
  unfrozenBalance: 'VRIJE BALANS',
  totalVotes: 'STEMMEN TOTAAL',
  amount: 'HOEVEELHEID',
  to: 'NAAR',
  from: 'VAN',
  tokenName: 'TOKEN NAAM',
  unityValue: 'STUKPRIJS',
  totalSupply: 'TOTAL SUPPLY',
  startTime: 'STARTTIJD',
  endTime: 'EINDTIJD',
  description: 'OMSCHRIJVING',
  votedAddress: 'STEM ADDRESS'
}

const transactionSuccess = {
  submitted: 'TRANSACTIE NAAR HET NETWORK VERZONDEN!',
  success: 'GELUKT!'
}

const votes = {
  title: 'STEMMEN',
  totalVotes: 'STEMMEN TOTAAL',
  votesAvailable: 'BESCHIKBARE STEMMEN',
  search: 'Zoeken',
  error: `Oeps, er was een fout tijdens het laden. Probeer opnieuw te laden`
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
