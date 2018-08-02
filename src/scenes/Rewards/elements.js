import styled, { css } from 'styled-components'
import { Colors } from '../../components/DesignSystem'

const BaseText = css`
  letter-spacing: 0;
  color: white;
`
const Centered = css`
  align-items: center;
  justify-content: center;
`
export const Wrapper = styled.View`
  ${Centered}
  margin-top: 15px;
`
export const AccountText = styled.Text`
  font-family: Rubik-Light;
  font-size: 18px;
  line-height: 18px;
  ${BaseText}
`
export const EarnedText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 12px;
  line-height: 18px;
  ${BaseText}
`
export const AmountText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 56px;
  line-height: 64px;
  ${BaseText}
  padding: 10px;
`
export const TokenBadge = styled.Text`
  background-color: white;
  border-radius: 3px;
  padding-vertical: 5px;
  padding-horizontal: 10px;
  shadowColor: black;
  shadowRadius: 5;
  shadowOpacity: 0.4;
`
export const TokenText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 14px;
  text-align: center;
  ${BaseText}
  color: ${Colors.orange};
`
export const ContinueButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 30px;
  ${Centered}
`
