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
  font-family: Rubik-Medium;
  color: #FFFFFF;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: 0.6px;
  top: 1;
`

export const AmountText = Text.extend`
  font-size: 32px;
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
export const DetailLabel = styled.Text`
  font-size: 12px;
  line-height: 20px;
  font-family: Helvetica;
  letter-spacing: 0.6;
  color: rgb(156, 158, 185);           
`
export const DetailText = styled.Text`
  font-size: 13px;
  font-weight: bold;
  line-height: 20px;
  font-family: Helvetica;
  color: white; 
`
