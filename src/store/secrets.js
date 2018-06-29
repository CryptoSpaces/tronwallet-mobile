import Realm from 'realm'
import sha256 from 'crypto-js/sha256';
import pbkdf2 from 'crypto-js/pbkdf2';
import hex from 'crypto-js/enc-hex';
import base64 from 'base-64'
import base64js from 'base64-js';
import DeviceInfo from 'react-native-device-info'

const SecretsSchema = {
  name: 'Secrets',
  primaryKey: 'id',
  properties: {
    id: 'string',
    address: 'string',
    password: 'string',
    mnemonic: 'string',
    privateKey: 'string',
    publicKey: 'string',
  }
}

const getRealmStore = async (key) => Realm.open({
  path: `secrets.realm`,
  schema: [SecretsSchema],
  schemaVersion: 1,
  encryptionKey: key
})

export default async () => {
  const uniqueId = DeviceInfo.getUniqueID();
  const didHex = hex.stringify(sha256(uniqueId));
  const pwdHex = hex.stringify(sha256(0));

  const key = pbkdf2(pwdHex, didHex, { keySize: 512 / 64 })
  const keyEnc64 = base64.encode(key.toString())
  const keyBytes = base64js.toByteArray(keyEnc64)
  const realm = await getRealmStore(keyBytes);
  return realm;
}
