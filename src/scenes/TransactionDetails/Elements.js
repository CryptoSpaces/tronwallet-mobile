import styled from 'styled-components'

export const Label = styled.Text`
  font-family: Rubik-Medium;
  font-size: 14px;
  color: #71739D;
`

export const Text = styled.Text`
  font-family: Helvetica;
  font-size: 14px;
  line-height: 24px;
  color: #DDDEE7;
  letter-spacing: 1.25;
`

export const CardLabel = Label.extend`
  color: #9C9EB9;
`

export const CardText = styled.Text`
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 700;
`

export const BadgeText = Text.extend`
  font-size: 16px;
  color: #FFFFFF;
  font-weight: 700;
`

export const AmountText = Text.extend`
  font-size: 45px;
  line-height: 55px;
  color: white;
  font-weight: 700;
`

export const TokenText = AmountText.extend`
  font-size: 30px;
  line-height: 40px;
`

export const DescriptionText = CardText.extend`
  font-weight: 100;
  line-height: 24px;
`
