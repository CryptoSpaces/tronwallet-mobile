import React from 'react'
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

const IconButton = ({ icon, iconColor, ...props }) => (
  <Wrapper {...props}>
    <Ionicons
      name={icon}
      size={16}
      color={iconColor}
    />
  </Wrapper>
)

IconButton.defaultProps = {
  bg: '#2E2F47',
  iconColor: '#9C9EB9'
}

export default IconButton
