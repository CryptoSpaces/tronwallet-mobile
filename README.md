# TronWallet
[![CircleCI](https://circleci.com/gh/gettyio/tronwallet-mobile/tree/development.svg?style=svg)](https://circleci.com/gh/gettyio/tronwallet-mobile/tree/development)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
[![GitHub issues](https://img.shields.io/github/issues/gettyio/tronwallet-mobile.svg)](https://github.com/gettyio/tronwallet-mobile/issues)
[![GitHub stars](https://img.shields.io/github/stars/gettyio/tronwallet-mobile.svg)](https://github.com/gettyio/tronwallet-mobile/stargazers)
[![GitHub license](https://img.shields.io/github/license/gettyio/tronwallet-mobile.svg)](https://github.com/gettyio/tronwallet-mobile/blob/development/LICENSE)


TronWallet is an open source fully decentralized p2p crypto wallet for TRON Network built with React Native.

## Creating a new wallet
As you launch your TronWallet app, after a short introductory splash screen, you will have two options to continue with your TronWallet experience: Create or Restore your wallet.

Clicking on Create Wallet will redirect you to a screen where you'll be asked to enter a PIN number twice. This will be your password for the app. Once you create your PIN we will ask you to write down a combination of 12 words required to recover your wallet should you need to. We strongly recommend that you back those up in the manner of your choosing, most of us write them down somewhere safe. Clicking on "I've written it down" will prompt you to repeat those words in the same order by tapping on the word buttons on the screen. With the proper order of words, you're ready to tap on confirm seed and start using your TronWallet app. For a limited time, there might also be a 'thank you' bonus for creating a wallet, so go get yours!


![Create Wallet Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/9399a76e3595ecbde5ae9b65f96b5fb2/TWCreateWalletSequence.jpg "Create Wallet Sequence")


&nbsp; 
## Restoring your wallet

To restore a wallet, tap on the Cogs icon in the navigation bar at the bottom of your screen. You will be redirected to the Settings screen where you'll see a "Restore Wallet" option. Tap on that button and type the 12 secret words in the correct order on the restore form next screen. Then, tap on restore and you'll get a warning telling you whether or not restoring your wallet was successful. If it wasn't it's usually a mistyped word so double-check them and try again.


![Restore Wallet Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/181fae79d7bcede278cf5120fd5327a0/TWRestoreWalletSequence.jpg "Restore Wallet Sequence")

&nbsp; 
## Creating a backup for your wallet

Backup your wallet by first tapping on the "Backup" option in the Settings Screen (the "cogs" icon on the navigation bar at the bottom of your screen) and entering your PIN. You'll be redirected to the Confirm Seed screen. After you've backed your 12 words up somewhere safe, tap on the "I've written it down" button, proceed to the next screen and tap on the correct order of words to confirm them. At this point we'll let you know if confirming your words was successful.


![Backup Wallet Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/61a5a6f843592be86d460dc2fc35ae44/TWBackupWalletSequence.jpg "Backup Wallet Sequence")

&nbsp; 
## Transferring TRX to a different wallet

On the page you land after launching the app (Balance screen) there will be a Send button. Tap on it and it will take you to the Send screen. You will be asked to provide the type of token, the address of the person you'd like to transfer funds to and the amount. You may start by selecting a token. Then, you can fill the address in (label "to") either by typing, pasting a previously copied address or tapping on the QRCode button to be directed to a screen where you can scan someone's address code. Finally, an amount form is available for you to tap the amount you'd like to send, using the phone's keyboard which will slide into screen once you tap on the form. After you submit the data you'll be taken to a screen where you can Review the transaction you want to make before submitting it. Once you are confident the information is correct, press "SEND" and you'll finally be redirected to the transactions Screen where you can keep tabs on all your operations within TronWallet.


![Send TRX Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/484d96b86f36c1cfffed80a6621321b3/TWSendTRXSequenceA.jpg "Send TRX Sequence")
![Send TRX Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/a35f3ec7476ca0af1fdc5867b3b5388f/TWSendTRXSequenceB.jpg "Send TRX Sequence")

&nbsp; 
## Transferring tokens to a different wallet

The process of transferring other tokens is the same as transferring TRX. Follow the same steps but select a different token for the transaction.

&nbsp; 
## Freezing TRX

Freezing TRX (required to generate Tron Power which is used to vote on Super Representatives) is similar in the way it operates in TronWallet to sending TRX. From the Balance Screen, you'll tap on the Freeze Button and then you'll be taken to the Freeze Screen. You can then select the amount you'd like to freeze by tapping on the 'Freeze Amount' form and use the keyboard to input the amount value. Tap on the Freeze button after you've decided on a value and you'll be redirected to a screen where you can review your transaction. When you are satisfied the information is correct, tap on submit transaction and follow your activity within TronWallet in the Transactions List Screen, where you will be sent for the final step of all transactions.


![FREEZE TRX Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/ee2b564429d1dbf0410fbaaede180a23/TWFreezeTRXSequence.jpg "FREEZE TRX Sequence")

&nbsp; 
## Voting for a Super Representative

To vote for a Super Representative first tap on the vote icon on the Tab bar at the bottom of the screen. Once you are in the Vote Screen, you can either search for a specific Representative Candidate using the Search bar or navigate the list of candidates and select the one you prefer. Having made a decision, tap on the name of the candidate to be taken to a screen where you can select the amount of votes you'd like to place. Then, tap on add vote. You will be directed back to the votes screen where you can place more votes if you so choose. After you've finalized your decision you can tap on confirm votes to go to the confirm votes screen where you can review the votes you wish to place. To proceed, tap on confirm, submit transaction, and follow your activities in the Transactions List Screen.


![Vote Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/86686f246ebfd725049f7675552c9996/TWVoteSR.jpg "Vote Sequence")
![Vote Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/a35f3ec7476ca0af1fdc5867b3b5388f/TWSendTRXSequenceB.jpg "Vote Sequence")

&nbsp; 
## Participating in a token

The process of participating in a new token starts by tapping on the participate icon (resembles a gold bag) in the tab bar at the bottom of the screen. You'll be taken to the Participate Screen where you'll find a list of different tokens to select from. Once you've decided on a token, tap on it and you'll see the amount selector screen. Decide on an amount of the token you wish to participate in and confirm. After submitting the transaction in the Transaction Details Screen you are done and can, as usual, review your activities in the Transactions List Screen.


![Participate Sequence](https://trello-attachments.s3.amazonaws.com/5adbc47262eab8642a28a9e7/5b59cdd981a8a5caa20f2d41/5ad6927425fb09db5a44a16d3fa14630/TWParticipateSequence.jpg "Participate Sequence")
