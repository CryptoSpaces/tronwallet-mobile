import React from 'react'
import styled from 'styled-components'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { transparentize } from 'polished'
import { TouchableOpacity } from 'react-native'

export const Label = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  color: #66688F;
  letter-spacing: 0.6;
  line-height: 11px;
`

export const Text = styled.Text`
  font-family: Rubik-Medium;
  font-size: 16px;
  color: #FFF;
  line-height: 16px;
`

export const KeyPad = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  height: 256px;
`

export const KeyWrapper = styled.TouchableOpacity`
  height: 64px;
  align-items: center;
  justify-content: center;
  flex-basis: 33%;
  flex-grow: 1;
  flex-shrink: 0;
  padding-bottom: 24px;
`

export const KeyText = styled.Text`
  font-family: Rubik-Regular;
  font-size: 24px;
  line-height: 24px;
  color: #FFFFFF;
`

export const Key = ({ children, ...props }) => (
  <KeyWrapper {...props}>
    <KeyText>
      {children}
    </KeyText>
  </KeyWrapper>
)

export const Wrapper = styled.View`
  width: 36px;
  height: 36px;
  border-radius: 18px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
`

Wrapper.defaultProps = {
  color: 'transparent'
}

export const Circle = styled.View`
  background-color: ${props => transparentize((1 - props.opacityAmount), props.color)};
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: ${props => props.size / 2}px;
  align-items: center;
  justify-content: center;
  z-index: 1;
`

Circle.defaultProps = {
  size: 12,
  opacityAmount: 1,
  color: '#2E2F47'
}

export const PinDigit = ({ digit, currentState }) => {
  if (digit < currentState.length) {
    return (
      <Wrapper>
        <Circle color='#F6CA1D' />
      </Wrapper>
    )
  }
  if (digit > currentState.length) {
    return (
      <Wrapper>
        <Circle />
      </Wrapper>
    )
  }
  return (
    <Wrapper>
      <Circle />
    </Wrapper>
  )
}

export const GoBackButton = props => (
  <TouchableOpacity
    style={{ position: 'absolute', top: 10, left: 8, padding: 16, zIndex: 1 }}
    {...props}
  >
    <Ionicons name='ios-arrow-round-back' size={32} color='#FFF' />
  </TouchableOpacity>
)
