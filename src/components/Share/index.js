import React from 'react'
import { TouchableOpacity, Share } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'

import tl from '../../utils/i18n'
import withContext from '../../utils/hocs/withContext'
import { Row } from '../../components/Utils'

const ShareButton = ({context, WrapperButton = TouchableOpacity, children}) => {
  const { publicKey: { value } } = context

  const share = () => {
    Share.share({
      message: tl.t('components.share.message', { address: value }),
      title: tl.t('components.share.title'),
      url: 'https://www.getty.io'
    }, {
      dialogTitle: tl.t('components.share.dialogTitle')
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
