import React from 'react'
import { TouchableOpacity, Share } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import withContext from '../../utils/hocs/withContext'
import { Row } from '../../components/Utils'

const ShareButton = ({context, WrapperButton = TouchableOpacity, children}) => {
  const { publicKey: { value } } = context

  const share = () => {
    Share.share({
      message: `This is my TronWallet address:\n\n ${value}\n\nTip: Once you have copied it you can paste it in your TronWallet app using the special button on Send screen.`,
      title: 'Share TronWallet address',
      url: 'https://www.getty.io'
    }, {
      dialogTitle: 'Share using:'
    })
  }

  return (
    <WrapperButton onPress={() => { share(value) }}>
      <Row>
        <Feather name='share-2' color='white' size={18} />
        {children && children}
      </Row>
    </WrapperButton>
  )
}

export default withContext(ShareButton)
