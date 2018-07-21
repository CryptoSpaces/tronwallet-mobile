import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import Feather from 'react-native-vector-icons/Feather'

import { Header, Title } from './elements'
import * as Utils from '../Utils'

const leftElement = (onBack, leftButton) => {
  let element = null

  if (onBack && !leftButton) {
    element = <TouchableOpacity onPress={onBack}>
      <Feather name='arrow-left' color='white' size={28} />
    </TouchableOpacity>
  } else {
    element = leftButton
  }
  return <Utils.View margin={10} position='absolute' left={10}>
    {element}
  </Utils.View>
}

const rightElement = (onClose, rightButton) => {
  let element = null
  if (onClose && !rightButton) {
    element = <TouchableOpacity onPress={onClose}>
      <Feather name='x' color='white' size={28} />
    </TouchableOpacity>
  } else {
    element = rightButton
  }
  return <Utils.View margin={10} position='absolute' right={10}>
    {element}
  </Utils.View>
}

const NavigationHeader = ({ title, onClose, rightButton, onBack, leftButton }) => {
  /*
    onClose = Right Button with X
    onBack = Left Button with <
  */

  return (
    <Header>
      {leftElement(onBack, leftButton)}
      <Title>{title.toUpperCase()}</Title>
      {rightElement(onClose, rightButton)}
    </Header>
  )
}

NavigationHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func,
  rightButton: PropTypes.element,
  onBack: PropTypes.func,
  leftButton: PropTypes.element
}

export default NavigationHeader
