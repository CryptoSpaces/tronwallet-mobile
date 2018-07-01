import { AsyncStorage } from 'react-native'


class NodeIp {
    constructor() {
        this.nodeIp = "35.231.121.122:50051"
        this.nodeSolidityIp = "35.231.121.122:50052"
    }

    async initNodes() {
        try {
            const setNode = () => AsyncStorage.setItem('NODE_IP', this.nodeIp)
            const setSolidityNode = () => AsyncStorage.setItem('NODE_SOLIDITY_IP', this.nodeSolidityIp)
            await Promise.all([setNode(), setSolidityNode()])
        } catch (error) {
            console.warn(error)
            throw new Error(error)
        }
    }

    async setAllNodesIp(mainnode, soliditynode) {
        try {
            const setNode = () => AsyncStorage.setItem('NODE_IP', mainnode)
            const setSolidityNode = () => AsyncStorage.setItem('NODE_SOLIDITY_IP', soliditynode)
            await Promise.all([setNode(), setSolidityNode()])
        } catch (error) {
            console.warn(error)
            throw new Error(error)
        }
    }

    async getAllNodesIp() {
        try {
            const [nodeIp, nodeSolidityIp] = await Promise.all([
                AsyncStorage.getItem("NODE_IP"),
                AsyncStorage.getItem("NODE_SOLIDITY_IP")
            ])
            if (nodeIp && nodeSolidityIp) return { nodeIp, nodeSolidityIp };
            else throw new Error('No node found!')
        } catch (error) {
            throw new Error(error)
        }
    }
}

export default new NodeIp();