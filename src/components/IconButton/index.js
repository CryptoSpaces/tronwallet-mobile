import React from 'react'
import styled from 'styled-components'
import Ionicons from 'react-native-vector-icons/Ionicons'

const Wrapper = styled.TouchableOpacity`
  height: 36px;
  width: 36px;
  border-radius: 4px;
  background-color: #2E2F47;
  align-items: center;
  justify-content: center;
  shadow-color: #000000;
  shadow-offset: 0 2px;
  shadow-radius: 4px;
  shadow-opacity: 0.5;
`

const IconButton = ({ icon, ...props }) => (
  <Wrapper {...props}>
    <Ionicons
      name={icon}
      size={16}
      color='#9C9EB9'
    />
  </Wrapper>
)

export default IconButton
