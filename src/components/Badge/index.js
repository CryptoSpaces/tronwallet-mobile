import React from 'react'
import styled from 'styled-components'
import * as Utils from '../../components/Utils'

const Wrapper = styled.View`
  background-color: ${props => props.bg};
  border-radius: 2px;
  paddingVertical: 7px;
  paddingHorizontal: 10px;
  shadow-offset: 0 5px;
  shadow-radius: 10px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  justify-content: center;
  position: relative;
  overflow: visible;
`

const Text = styled.Text`
  top: 1px;
  font-size: 13px;
  font-family: Rubik-Medium;
  line-height: 14px;
  color: #FFFFFF;
`

const Guarantee = styled.View`
  z-index: 999;
  left: -3;
  elevation: 1;
`

const Image = styled.Image`
  width: 15px;
  height: 15px;
`

const Badge = ({ bg = '#2E2F47', guarantee, children }) => (
  <Utils.Row align='center'>
    <Wrapper bg={bg}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </Wrapper>
    {guarantee && (
      <Guarantee>
        <Image source={require('../../assets/guarantee.png')} />
      </Guarantee>
    )}
  </Utils.Row>
)

export default Badge
