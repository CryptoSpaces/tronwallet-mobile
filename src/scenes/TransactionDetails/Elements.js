import styled from 'styled-components'

export const Label = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  color: #71739D;
`

export const Text = styled.Text`
  font-family: Helvetica;
  font-size: 14px;
  line-height: 24px;
  color: #DDDEE7;
  letter-spacing: 1.25;
`

export const BadgeText = Text.extend`
  line-height: 16px;
  color: #000000;
`

export const Heading = styled.Text`
  font-family: Rubik-Medium;
  font-size: 20px;
  line-height: 36px;
  color: #FFFFFF;
`

export const SubHeading = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  line-height: 11px;
  color: #9C9EB9;
`
