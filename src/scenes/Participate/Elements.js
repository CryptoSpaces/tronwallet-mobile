import styled from 'styled-components'
import { View } from '../../components/Utils'

export const Text = styled.Text`
  color: white;
  font-family: 'rubik-regular';
  font-size: 10;
`

export const TokenPrice = styled.Text`
  color: white;
  font-size: 14;
  font-family: 'rubik-medium';
`

export const FeaturedTokenPrice = TokenPrice.extend`
  font-size: 18;
`

export const TokenName = TokenPrice.extend`
  font-size: 13;
`

export const FeaturedTokenName = TokenName.extend`
  font-size: 18;
  text-align: center;
  font-family: 'rubik-bold';
`

export const Card = View.extend`
  margin-left: 15;
  margin-right: 20;
  border-radius: 4;
  background: rgb(44,45,67);
  height: 85;
  overflow: hidden;
`

export const CardContent = View.extend`
  padding: 19px 10px 8px 16px;
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
  font-family: 'rubik-medium';
  text-align: center;
`

export const VerticalSpacer = styled.View`
  height: ${props => props.size};
`

export const HorizontalSpacer = styled.View`
  width: ${props => props.size};
`
