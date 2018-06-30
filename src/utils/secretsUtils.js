import RNTron from 'react-native-tron'
import getSecretsStore from '../store/secrets'
import DeviceInfo from 'react-native-device-info'
import Client from '../services/client'

export const createUserKeyPair = async () => {
    try {
        const mnemonic = await RNTron.generateMnemonic();
        await generateKeypair(mnemonic);
        alert("We've created an account for you. You can review at settings.")
    } catch (error) {
        console.log("Error no create user key pair", error);
        throw new Error('Something wrong creating user keypair');
    }
}

export const recoverUserKeypair = async (mnemonic) => {
    try {
        const validateMnemonic = await RNTron.validateMnemonic(mnemonic);
        if (validateMnemonic !== 'VALID') throw new Error('Invalid keypair');
        await generateKeypair(mnemonic);
        alert('Wallet recovered!');
    } catch (error) {
        console.log(error);
        throw new Error('Something wrong recovering user keypair, try');
    }
}

const generateKeypair = async (mnemonic) => {
    const generatedKeypair = await RNTron.generateKeypair(mnemonic, 0, false);
    generatedKeypair.mnemonic = mnemonic;
    generatedKeypair.id = DeviceInfo.getUniqueID();
    const SecretsStore = await getSecretsStore();
    await SecretsStore.write(() => SecretsStore.create('Secrets', generatedKeypair, true));
    await Client.setUserPk(generatedKeypair.address);
}

const emptySecrets = {
    privateKey: null,
    mnemonic: null,
    publicKey: null
}

export const getUserSecrets = async () => {
    try {
        const SecretsStore = await getSecretsStore();
        const [realmSecrets] = SecretsStore.objects('Secrets').map(item => Object.assign(item, {}));
        if (realmSecrets) {
            return {
                privateKey: realmSecrets.privateKey,
                mnemonic: realmSecrets.mnemonic,
                publicKey: realmSecrets.address
            }
        } else {
            return emptySecrets;
        }

    } catch (error) {
        console.log(error);
        throw new Error('Something wrong getting user secrets');
    }
}