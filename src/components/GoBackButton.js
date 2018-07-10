import React from 'react'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'

import * as Utils from './Utils'
import { Colors } from './DesignSystem'

const GoBackButton = ({ navigation }) => (
  <Utils.ButtonWrapper
    absolute
    side='right'
    onPress={() => {
      navigation.goBack()
    }}
  >
    <Ionicons name='ios-close' size={40} color={Colors.primaryText} />
  </Utils.ButtonWrapper>
)

GoBackButton.propTypes = {
  navigation: PropTypes.object.isRequired
}

export default GoBackButton
