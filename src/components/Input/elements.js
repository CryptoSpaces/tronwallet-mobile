import styled from 'styled-components'

export const Wrapper = styled.View`
  padding-vertical: 6px;
  position: relative;
`

export const InputWrapper = styled.View`
  padding: 8px;
  border-radius: 4px;
  border-width: 1px;
  border-color: #51526B;
  flex-direction: row;
  align-items: center;
`

export const LabelWrapper = styled.View`
  padding-vertical: 2px;
  padding-horizontal: 4px;
  background-color: #191A2A;
  z-index: 999;
  position: absolute;
  left: 5px;
`

export const Label = styled.Text`
  font-size: 10px;
  font-family: Rubik-Medium;
  letter-spacing: 0.55;
  line-height: 11px;
  color: #66688F;
`

export const TextInput = styled.TextInput`
  font-family: Rubik-Medium;
  font-size: 16px;
  line-height: 18px;
  color: #FFFFFF;
  flex: 1;
  padding: 8px;
  ${props => props.align && `text-align: ${props.align}`};
`
