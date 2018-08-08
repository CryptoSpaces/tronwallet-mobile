import Client from '../services/client'
import getAssetsStore from '../store/assets'

export const updateAssets = async (start = 0, limit = 100, name = '') => {
  const assets = await Client.getTokenList(start, limit, name)
  const store = await getAssetsStore()

  store.write(() => assets.map(asset => store.create('Asset', asset, true)))

  return assets
}

export const orderAssets = (assets) => {
  let orderedVerified = []
  let rest = []
  const verifyAsset = (index, asset) => {
    asset.verified = true
    orderedVerified[index] = asset
  }
  assets.forEach((asset) => {
    switch (asset.name) {
      case 'TRX':
        verifyAsset(0, asset)
        break
      case 'TWX':
        verifyAsset(1, asset)
        break
      case 'CryptoChain':
        verifyAsset(2, asset)
        break
      default:
        rest.push(asset)
    }
  })

  return [
    ...orderedVerified.filter((asset) => asset),
    ...rest
  ]
}
