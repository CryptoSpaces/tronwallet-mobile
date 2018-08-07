const general = {
  success: 'Success',
  warning: 'Warning',
  cancel: 'Cancel',
  ok: 'OK'
}

const firstTime = {
  button: {
    create: 'CREATE WALLET',
    restore: 'RESTORE WALLET'
  }
}

const pin = {
  title: 'SECURITY CHECK',
  enter: 'Enter PIN',
  reenter: 'Re-Enter PIN'
}

const seed = {
  confirm: {
    title: 'CONFIRM SEED',
    error: {
      title: 'Wrong Combination',
      message: `Selected words don't match. Make sure you wrote the words in the correct order.`
    },
    explanation: 'Select the words below in the right order to confirm your secret phrase.',
    button: {
      reset: 'RESET WORDS',
      confirm: 'CONFIRM SEED'
    }
  },
  create: {
    title: 'CONFIRM WALLET SEED',
    error: 'Oops, we have a problem. Please restart the application.',
    button: {
      written: `I'VE WRITTEN IT DOWN`,
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
  partners: 'PARTNERS'
}

export default {
  firstTime,
  pin,
  seed,
  settings,
  ...general
}
