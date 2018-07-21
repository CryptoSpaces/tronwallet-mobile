import React from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'

import * as Utils from '../../components/Utils'

const Wrapper = styled.View`
  background-color: ${props => props.bg};
  border-radius: 2px;
  paddingVertical: ${props => props.large ? 10 : 7}px;
  paddingHorizontal: ${props => props.large ? 18 : 10}px;
  shadow-offset: 0 5px;
  shadow-radius: 10px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  justify-content: center;
  position: relative;
`

const Text = styled.Text`
  top: 1px;
  font-size: ${props => props.large ? 18 : 13}px;
  font-family: Rubik-Medium;
  line-height: ${props => props.large ? 18 : 14}px;
  color: ${props => props.color};
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

const Badge = ({ bg = '#2E2F47', textColor = '#FFFFFF', large, guarantee, children }) => (
  <Utils.Row align='center'>
    <Wrapper large={large} bg={bg}>
      {typeof children === 'string' ? <Text color={textColor} large={large}>{children}</Text> : children}
    </Wrapper>
    {guarantee && (
      <Guarantee>
        <Image source={require('../../assets/guarantee.png')} />
      </Guarantee>
    )}
  </Utils.Row>
)

Badge.propTypes = {
  bg: PropTypes.string,
  textColor: PropTypes.string,
  size: PropTypes.string,
  guarantee: PropTypes.bool
}

export default Badge
