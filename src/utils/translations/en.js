const general = {
  success: 'Success',
  warning: 'Warning',
  cancel: 'Cancel',
  ok: 'OK',
  error: {
    default: 'Woops something went wrong. Try again later, If the error persist try to update the network settings.',
    buildingTransaction: 'Error while building transaction, try again.',
    gettingTransaction: 'Error while getting transaction.',
    clipboardCopied: 'Something wrong while copying'
  },
  tronPower: 'TRON POWER',
  trxPrice: 'TRX PRICE',
  confirmed: 'Confirmed',
  unconfirmed: 'Unconfirmed',
  transactionType: {
    transfer: 'Transfer',
    transferAsset: 'Transfer Asset',
    freeze: 'Freeze',
    unfreeze: 'Unfreeze',
    vote: 'Vote',
    participate: 'Participate',
    create: 'Create',
    undefined: 'Undefined Type'
  },
  ends: 'Ends',
  clear: 'Clear',
  allIn: 'All In'
}

const balance = {
  title: 'BALANCE',
  error: {
    loadingData: 'An error occured while loading the data.',
    savingCurrency: 'Error saving preferred currency'
  },
  chooseCurrency: 'Please, choose your preferred currency.',
  confirmSeed: 'Please tap to confirm your 12 seed words',
  bandwidth: 'BANDWITH',
  tokens: 'TOKENS',
  holdings: 'HOLDINGS'
}

const components = {
  share: {
    title: 'Share TronWallet address',
    message: `This is my TronWallet address:\n\n {{address}}\n\nTip: Once you have copied it you can paste it in your TronWallet app using the special button on Send screen.`,
    dialogTitle: 'Share using:'
  },
  QRScanner: {
    title: 'Address Scanner',
    explanation: 'Scan the QRCode to identify the target user',
    permissionMessage: 'To scan the public key the app needs your permission to access the camera.'
  },
  vote: {
    enterVote: 'ENTER THE VOTE VALUE',
    votesRemaining: 'VOTES REMAINING',
    setVote: 'SET VOTE',
    moreVotes: 'If you need more votes you can Freeze more TRX.',
    confirmVotes: 'CONFIRM VOTES',
    yourVotes: 'Your Votes',
    myVotes: 'MY VOTES',
    confirm: 'CONFIRM',
    freeze: 'Freeze',
    totalVotes: 'Total votes available:',
    delete: 'DELETE',
    set: 'SET',
    freezeOrLower: 'You do not have enough frozen TRX. Freeze more TRX or lower the vote amount',
    freezeToContinue: 'You do not have enough frozen TRX. Freeze more TRX to continue'
  }
}

const firstTime = {
  button: {
    create: 'CREATE WALLET',
    restore: 'RESTORE WALLET'
  }
}

const freeze = {
  title: 'FREEZE',
  unfreeze: {
    title: 'UNFREEZE',
    inThreeDays: 'After a three day period you can unfreeze your TRX',
    inXMinutes: 'You can unfreeze your TRX in {{minutes}} minutes.',
    inXHours: 'You can unfreeze your TRX in {{hours}} hours.',
    inXDays: 'You can unfreeze your TRX in {{days}} days.',
    now: 'You can unfreeze your TRX now.'
  },
  error: {
    minimumAmount: 'The minimum amount for any freeze transaction is 1.',
    insufficientBalance: 'Insufficient TRX balance',
    roundNumbers: 'Can only freeze round numbers'
  },
  amount: 'FREEZE AMOUNT',
  balance: 'Balance'
}

const getVault = {
  notInstalled: `It seems that you don't have Tron Vault installed in your phone to proceed with your transaction.`,
  downloadHere: 'You can download it here'
}

const market = {
  time: {
    hour: '1H',
    day: '1D',
    week: '1W',
    month: '1M',
    all: 'ALL'
  },
  highest: 'HIGHEST',
  lowest: 'LOWEST',
  volume: 'VOLUME 24H',
  cap: 'MARKET CAP',
  supply: 'CIRCULATING SUPPLY'
}

const participate = {
  title: 'PARTICIPATE',
  featured: 'FEATURED',
  button: {
    confirm: 'CONFIRM',
    moreInfo: 'MORE INFO',
    buyNow: 'BUY NOW'
  },
  error: {
    insufficientBalance: 'Not enough funds (TRX) to participate.',
    insufficientTrx: {
      title: 'You need to buy at least one TRX worth of {{token}}.',
      message: 'Currently you are buying only {{amount}}.'
    }
  },
  warning: `You don't have enough TRX to buy that many {{token}}.`,
  amountToBuy: 'AMOUNT TO BUY',
  pricePerToken: 'PRICE PER TOKEN',
  tokenDescription: 'TOKEN DESCRIPTION',
  tokenInfo: 'TOKEN INFO',
  token: 'TOKEN',
  tokens: 'TOKENS',
  frozen: 'FROZEN',
  percentage: 'PERCENTAGE',
  issued: 'ISSUED',
  totalSupply: 'TOTAL SUPPLY',
  startTime: 'START TIME',
  endTime: 'END TIME',
  description: 'DESCRIPTION',
  transaction: 'TRANSACTION',
  ownerAddress: 'OWNER ADDRESS',
  trxNum: 'TRX NUM',
  num: 'NUM',
  block: 'BLOCK'
}

const pin = {
  title: 'SECURITY CHECK',
  enter: 'Enter PIN',
  reenter: 'Re-Enter PIN'
}

const receive = {
  title: 'RECEIVE',
  clipboardCopied: 'Copied to clipboard',
  button: {
    copy: 'Copy',
    share: 'Share'
  }
}

const rewards = {
  title: 'REWARDS',
  earned: 'You have earned'
}

const seed = {
  confirm: {
    title: 'CONFIRM SEED',
    error: {
      title: 'Wrong Combination',
      message: `Selected words don't match. Make sure you wrote the words in the correct order.`
    },
    success: 'Wallet successfully confirmed',
    explanation: 'Select the words below in the right order to confirm your secret phrase.',
    button: {
      reset: 'RESET WORDS',
      confirm: 'CONFIRM SEED'
    }
  },
  create: {
    title: 'CONFIRM WALLET SEED',
    error: 'Oops, we have a problem. Please restart the application.',
    generateNew: 'This will generate a completely new wallet.',
    button: {
      written: `I'VE WRITTEN IT DOWN`,
      newSeed: 'GET NEW SEED',
      later: 'Confirm later'
    }
  },
  restore: {
    title: 'RESTORE WALLET',
    explanation: `To restore your wallet, please provide the same 12 words that you wrote on paper when you created your wallet for the first time. If you enter a different sequence of words, a new empty wallet will be created.`,
    placeholder: 'Please, type your 12 seed words here',
    success: 'Wallet restored with success!',
    warning: 'Restore seed will erase all data on this device and pull information from the network for the restored account.',
    error: `Oops. Looks like the words you typed aren't a valid mnemonic seed. Check for a typo and try again.`,
    button: 'RESTORE'
  }
}

const send = {
  title: 'SEND',
  error: {
    insufficientBalance: 'Not enough balance.',
    gettingBalance: 'Error while getting balance data',
    incompleteAddress: 'Address is either incomplete or invalid.',
    invalidReceiver: 'Invalid receiver address',
    selectBalance: 'Select a balance first',
    invalidAmount: 'Invalid amount'
  },
  input: {
    token: 'TOKEN',
    to: 'TO',
    amount: 'AMOUNT'
  },
  available: 'available',
  chooseToken: 'Please, choose a token below.',
  minimumAmount: 'The minimum amount for any send transaction is 0.000001.'
}

const settings = {
  title: 'SETTINGS',
  notifications: {
    title: 'Notifications Subscription',
    description: 'Enable or disable push notifications'
  },
  network: {
    title: 'Network',
    description: 'Choose a node of your preference',
    modal: {
      title: 'NETWORK',
      explanation: 'With this option you can select the node that will better suit your needs and preferences. Please be careful while updating the node IP while wrong IP can lead to malfunctions within your wallet. Example: 35.231.121.122:50051',
      error: {
        storage: 'Error getting node ip from local storage',
        invalidIp: 'Please put a valid IP',
        update: 'Something went wrong while updating nodes ip',
        reset: 'Something wrong while reseting node ip'
      },
      success: {
        updated: 'Updated',
        updatedIp: 'Nodes IP updated!',
        switchTest: 'Switched nodes IP to Testnet',
        switchMain: 'Switched nodes IP to default main',
        reset: 'Node IP reseted!'
      },
      placeholder: {
        loadingIp: 'Loading IP',
        loadingPort: 'Loading Port'
      },
      button: {
        update: 'Update and Connect',
        reset: 'Reset'
      },
      mainNode: 'Main Node',
      solidityNode: 'Solidity Node',
      testNet: 'TestNet'
    }
  },
  backup: {
    title: 'Backup Wallet',
    description: 'Backup your secret words'
  },
  restore: {
    title: 'Restore Wallet',
    description: 'Restore previously used 12 secrets words'
  },
  reset: {
    title: 'Reset Wallet',
    description: 'Restart all data from current wallet',
    warning: `Warning: This action will erase all saved data including your 12 secret words. If you didn't save your secret, please do it before continue.`,
    button: 'OK, I understand it'
  },
  language: {
    title: 'Change Language',
    description: 'Change the app Language',
    choose: 'Please, choose a Language below:',
    success: 'Language changed to {{language}}, please restart the app',
    error: 'Error saving preferred language'
  },
  partners: 'PARTNERS'
}

const submitTransaction = {
  title: 'TRANSACTION DETAILS',
  notification: 'You have received a transaction from {{address}}',
  button: {
    tryAgain: 'Try again',
    submit: 'SUBMIT TRANSACTION'
  },
  disconnectedMessage: 'It seems that you are disconnected. Reconnect to the internet before proceeding with the transaction.',
  dic: {
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
  title: 'MY TRANSACTIONS',
  from: 'From',
  to: 'To',
  notFound: 'No transactions found.'
}

const transactionDetails = {
  title: 'TRANSACTION',
  clipboard: {
    tronscanUrl: 'Tronscan url for this transaction copied to the clipboard',
    publicKey: 'Public Key copied to the clipboard'
  },
  hash: 'HASH',
  status: 'STATUS',
  time: 'TIME',
  block: 'BLOCK',
  frozenBalance: 'FROZEN BALANCE',
  unfrozenBalance: 'UNFROZEN BALANCE',
  totalVotes: 'TOTAL VOTES',
  amount: 'AMOUNT',
  to: 'TO',
  from: 'FROM',
  tokenName: 'TOKEN NAME',
  unityValue: 'UNITY VALUE',
  totalSupply: 'TOTAL SUPPLY',
  startTime: 'START TIME',
  endTime: 'END TIME',
  description: 'DESCRIPTION',
  votedAddress: 'VOTED ADDRESS'
}

const transactionSuccess = {
  submitted: 'TRANSACTION SUBMITTED TO NETWORK!',
  success: 'SUCCESS!'
}

const votes = {
  title: 'VOTES',
  totalVotes: 'TOTAL VOTES',
  votesAvailable: 'VOTES AVAILABLE',
  search: 'Search',
  error: `Oops, something didn't load correctly. Try to reload`
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
