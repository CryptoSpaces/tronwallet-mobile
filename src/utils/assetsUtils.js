import Client from '../services/client'
import getAssetsStore from '../store/assets'

export const updateAssets = async (start = 0, limit = 100, name = '') => {
  const assets = await Client.getTokenList(start, limit, name)
  const store = await getAssetsStore()

  store.write(() => assets.map(asset => store.create('Asset', asset, true)))

  return assets
}
