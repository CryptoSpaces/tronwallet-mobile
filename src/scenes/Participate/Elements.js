import styled from 'styled-components'
import { View } from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'

export const Text = styled.Text`
  color: white;
  font-family: 'Rubik-Regular';
  font-size: 10;
`

export const TokenPrice = styled.Text`
  color: white;
  font-size: 14;
  font-family: 'Rubik-Medium';
`

export const FeaturedTokenPrice = TokenPrice.extend`
  font-size: 18;
  line-height: 18px;
  height: 18px;
`

export const TokenName = TokenPrice.extend`
  font-size: 13;
`

export const FeaturedTokenName = TokenName.extend`
  font-size: 18;
  text-align: center;
  font-family: 'Rubik-Bold';
`

export const Card = View.extend`
  margin-left: 15;
  margin-right: 20;
  border-radius: 4;
  background: rgb(44,45,67);
  min-height: 85;
  overflow: hidden;
`

export const CardContent = View.extend`
  padding: 19px 15px 15px 15px;
`

export const Featured = View.extend`
  width: 79;
  height: 12;
  position: absolute;
  left: 50%;
  transform: translate(-45px, 0);
  background: rgb(255,65,101);
  border-bottom-left-radius: 3;
  border-bottom-right-radius: 3;
`

export const FeaturedText = Text.extend`
  font-size: 9;
  font-family: 'Rubik-Medium';
  text-align: center;
`

export const VerticalSpacer = styled.View`
  height: ${props => props.size};
`

export const HorizontalSpacer = styled.View`
  width: ${props => props.size};
`

export const BuyContainer = styled.View`
  padding: 11.9px 33px 0px 31px;
`

export const MarginFixer = styled.View`
  margin-left: 27;
  margin-right: 29;
`

export const BuyText = styled.Text`
  text-align: left;
  font-size: 11;
  font-family: 'Rubik-Medium';
  letter-spacing: 0.6;
  color: rgb(116, 118, 162);
`

export const WhiteBuyText = BuyText.extend`
  text-align: right;
  color: rgb(221, 222, 231);
`

export const AmountText = WhiteBuyText.extend`
  color: rgb(225, 225, 225);
  font-size: 40;
`

export const TrxValueText = AmountText.extend`
  font-size: 16;
`

export const MoreInfoButton = styled.View`
  align-self: center;
  background: rgb(116, 118, 162);
  height: 50;
  width: 151;
  border-radius: 4;
  justify-content: center;
`

export const ButtonText = styled.Text`
  color: white;
  font-family: 'Rubik-Bold';
  font-size: 12;
  text-align: center;
  letter-spacing: 0.8;
`
export const BuyButton = styled.View`
  background-color: rgb(44,45,67);
  border-radius: 5px;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  padding-vertical: 13px;
  padding-horizontal: 30px;
`
export const TokensTitle = styled.Text`
  font-family: Rubik-Medium;
  font-size: 15px;
  margin-left: 20px;
  color: ${Colors.secondaryText};
`
