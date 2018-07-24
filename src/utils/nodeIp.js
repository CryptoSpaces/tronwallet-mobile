import { AsyncStorage } from 'react-native'

class NodeIp {
  constructor () {
    this.nodeIp = '54.236.37.243:50051'
    this.nodeSolidityIp = '54.236.37.243:50052'
    this.nodeIpTestnet = '18.216.36.219:50051'
    this.nodeSolidityIpTestnet = '18.204.117.182:50051 '
  }

  getStorageNodes = async () => {
    try {
      const [nodeIp, nodeSolidityIp, nodeType] = await Promise.all([
        AsyncStorage.getItem('NODE_IP'),
        AsyncStorage.getItem('NODE_SOLIDITY_IP'),
        AsyncStorage.getItem('NODE_TYPE')
      ])
      if (nodeIp && nodeSolidityIp) return { nodeIp, nodeSolidityIp, isTestnet: nodeType === 'test' }
      else return null
    } catch (error) {
      console.warn(error)
      return { nodeIp: this.nodeIp, nodeSolidityIp: this.nodeSolidityIp, isTestnet: false }
    }
  }

  async initNodes () {
    try {
      const nodes = await this.getStorageNodes()
      if (nodes) return
      const setSwitchTestnet = () => AsyncStorage.setItem('NODE_TYPE', 'main')
      const setNode = () => AsyncStorage.setItem('NODE_IP', this.nodeIp)
      const setSolidityNode = () =>
        AsyncStorage.setItem('NODE_SOLIDITY_IP', this.nodeSolidityIp)
      await Promise.all([setNode(), setSolidityNode(), setSwitchTestnet()])
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  async setNodeIp (type, nodeip) {
    // Types
    // 'main' or 'solidity'
    try {
      const item = type === 'solidity' ? 'NODE_SOLIDITY_IP' : 'NODE_IP'
      await AsyncStorage.setItem(item, nodeip)
    } catch (error) {
      console.warn(error)
      throw error
    }
  }
  async setAllNodesIp (mainnode, soliditynode) {
    try {
      const setNode = () => AsyncStorage.setItem('NODE_IP', mainnode)
      const setSolidityNode = () =>
        AsyncStorage.setItem('NODE_SOLIDITY_IP', soliditynode)
      await Promise.all([setNode(), setSolidityNode()])
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  async getAllNodesIp () {
    try {
      const nodes = await this.getStorageNodes()
      if (nodes) return nodes
      else throw new Error('No node found!')
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  async setToTestnet () {
    try {
      const setNode = () => AsyncStorage.setItem('NODE_IP', this.nodeIpTestnet)
      const setSolidityNode = () =>
        AsyncStorage.setItem('NODE_SOLIDITY_IP', this.nodeSolidityIpTestnet)
      await Promise.all([setNode(), setSolidityNode()])
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  async resetNodesIp (type) {
    // Types
    // 'main' or 'solidity'
    try {
      const item = type === 'solidity' ? 'NODE_SOLIDITY_IP' : 'NODE_IP'
      const newIp = type === 'solidity' ? this.nodeSolidityIp : this.nodeIp
      await AsyncStorage.setItem(item, newIp)
    } catch (error) {
      console.warn(error)
      throw error
    }
  }

  async switchTestnet (switchValue) {
    // Node Types
    // 'main' for main net  or 'test'test net
    try {
      if (switchValue) {
        await this.setToTestnet()
      } else {
        await Promise.all([this.resetNodesIp('main'), this.resetNodesIp('solidity')])
      }
      const type = switchValue ? 'test' : 'main'
      await AsyncStorage.setItem('NODE_TYPE', type)
    } catch (error) {
      console.warn(error)
      throw error
    }
  }
}

export default new NodeIp()
