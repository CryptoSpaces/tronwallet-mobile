import styled from 'styled-components'
import { FontSize } from '../../components/DesignSystem'

export const Label = styled.Text`
  font-family: Rubik-Medium;
  font-size: ${FontSize.smaller};
  color: #71739D;
`

export const Text = styled.Text`
  font-family: Helvetica;
  font-size: ${FontSize.smaller};
  line-height: 24px;
  color: #DDDEE7;
  letter-spacing: 1.25;
`

export const CardLabel = Label.extend`
  color: #9C9EB9;
`

export const CardText = styled.Text`
  font-size: ${FontSize.small};
  color: #FFFFFF;
  font-weight: 700;
`

export const BadgeText = Text.extend`
  font-size: ${FontSize.small};
  color: #FFFFFF;
  font-weight: 700;
`

export const AmountText = Text.extend`
  font-size: ${FontSize.large};
  line-height: 55px;
  color: white;
  font-weight: 700;
`

export const TokenText = AmountText.extend`
  font-size: ${FontSize.medium};
  line-height: 40px;
`

export const DescriptionText = CardText.extend`
  font-weight: 100;
  line-height: 24px;
`
