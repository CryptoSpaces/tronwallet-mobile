import Client from '../services/client'
import getAssetsStore from '../store/assets'

export const updateAssets = async () => {
  const assets = await Client.getTokenList()
  const store = await getAssetsStore()

  store.write(() => assets.map(asset => store.create('Asset', asset, true)))
}
