import React from 'react'
import { TouchableHighlight } from 'react-native'
import styled from 'styled-components'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Wrapper = styled.TouchableOpacity`
  height: 36px;
  width: 36px;
  border-radius: 4px;
  background-color: ${props => props.bg};
  align-items: center;
  justify-content: center;
  elevation: 2;
  shadow-color: #000000;
  shadow-offset: 0 2px;
  shadow-radius: 4px;
  shadow-opacity: 0.5;
`

const HighlightWrapper = Wrapper.withComponent(TouchableHighlight)

const IconButton = ({ icon, iconColor, highlight, ...props }) => (
  !highlight ? (
    <Wrapper {...props}>
      <Ionicons
        name={icon}
        size={16}
        color={iconColor}
      />
    </Wrapper>
  ) : (
    <HighlightWrapper {...props}>
      <Ionicons
        name={icon}
        size={16}
        color={iconColor}
      />
    </HighlightWrapper>
  )
)

IconButton.defaultProps = {
  bg: '#2E2F47',
  iconColor: '#9C9EB9',
  highlight: false
}

export default IconButton
