import React from 'react'
import { TouchableOpacity } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import withContext from '../../utils/hocs/withContext'

const ShareButton = ({context}) => (
  <TouchableOpacity onPress={context.toggleShare}>
    <Feather name='share-2' color='white' size={18} />
  </TouchableOpacity>
)

export default withContext(ShareButton)
