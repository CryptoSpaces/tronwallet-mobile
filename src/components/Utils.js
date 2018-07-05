import React from 'react'
import styled, { css } from 'styled-components'
import { ImageBackground, Picker } from 'react-native'
import PropTypes from 'prop-types'
import { tint } from 'polished'

import { Colors, Spacing, FontSize } from './DesignSystem'

const tronWalletBorder = css`
  border-color: ${Colors.secondaryText};
  border-radius: 5px;
`;

export const Header = styled.View`
  height: 90px;
  flex-direction: row;
  align-items: center;
  background-color: black;
  border-bottom-width: 1px;
  border-color: black;
`

export const Title = styled.Text`
  color: white;
  font-weight: 700;
  padding-left: 16;
  font-size: 26;
`

export const TitleWrapper = styled.View`
  flex: 1;
  height: 100%;
  background-color: black;
  justify-content: center;
`

export const View = styled.View`
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  ${props => props.flex && css`flex: ${props.flex};`}
  ${props => props.height && css`height: ${props.height};`}
  ${props => props.width && css`width: ${props.width};`}
  ${props => props.background && css`background-color: ${props.background};`}
  ${props => props.borderWidth && css`border-width: ${props.borderWidth};`}
  ${props => props.borderColor && css`border-color: ${props.borderColor};`}
  ${props => props.paddingX && css`padding-horizontal: ${props.paddingX};`}
`

View.defaultProps = {
  align: 'stretch',
  justify: 'flex-start'
}

View.propTypes = {
  align: PropTypes.oneOf(['stretch', 'center', 'flex-start', 'flex-end', 'baseline']),
  justify: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']),
  position: PropTypes.oneOf(['absolute', 'relative']),
  flex: PropTypes.number
}

export const Container = View.extend.attrs({
  flex: 1,
  background: Colors.background
})``

export const Content = View.extend.attrs({
  paddingSize: 'big'
})`
  padding: ${props => Spacing[props.paddingSize]}px;
  ${props => props.background && css`background-color: ${props.background};`}
  ${props => props.marginY && css`margin-vertical: ${props.marginY}px;`}
  ${props => props.marginX && css`margin-horizontal: ${props.marginX}px;`}
`

export const StatusBar = styled.View`
  height: 12px;
  background-color: ${Colors.background};
  ${props => props.transparent && css`background-color: transparent;`}
`

export const LoadButton = styled.TouchableOpacity`
  height: 32px;
  width: 32px;
  border-radius: 10px;
`

export const LoadButtonWrapper = styled.View`
  height: 50px;
  width: 50px;
  align-self: center;
  justify-content: center;
`


export const ContentWithBackground = Content.withComponent(ImageBackground)

export const Row = View.extend`
  flex-direction: row;
  ${props => props.wrap && css`flex-wrap: ${props.wrap};`}
`

export const Column = View.extend`
  flex-direction: column;
`

export const HorizontalSpacer = styled.View`
  width: ${props => Spacing[props.size]}px;
`

HorizontalSpacer.defaultProps = {
  size: 'small'
}

HorizontalSpacer.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'big', 'large'])
}

export const VerticalSpacer = styled.View`
  height: ${props => Spacing[props.size]}px;
`

VerticalSpacer.defaultProps = {
  size: 'small'
}

VerticalSpacer.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'big', 'large'])
}

export const Text = styled.Text`
  font-family: Rubik-Medium;
  color: ${props => props.color};
  font-size: ${props => FontSize[props.size]};
  ${props => props.marginY && css`margin-vertical: ${props.marginY}px`};
  ${props => props.align && css`text-align: ${props.align}`};
  ${props => props.font && css`font-family: rubik-${props.font}`};
  ${props => props.secondary && css`color: ${Colors.secondaryText}`};
  ${props => props.success && css`color: ${Colors.green}`};
  ${props => props.lineHeight && css`line-height: ${props.lineHeight}`};
  ${props => props.letterSpacing && css`letter-spacing: ${props.letterSpacing}`};
  ${props => props.marginBottom && css`margin-bottom: ${props.marginBottom}px`};
  ${props => props.marginTop && css`margin-top: ${Spacing[props.marginTop]}px`};
`

Text.defaultProps = {
  size: 'small',
  color: Colors.primaryText
}

Text.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  marginTop: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  lineHeight: PropTypes.number,
  font: PropTypes.oneOf(['bold', 'light', 'medium'])
}

export const Item = styled.View`
  ${props => props.padding && css`padding: ${props.padding}px`};
  border-color: ${Colors.secondaryText};
  ${props => props.borderColor && css`border-color: ${props.borderColor}`};
  border-bottom-width: 0.2px;
  ${props => props.top && css`border-top-width: 0.2px`}
`

export const Label = styled.View`
  padding: ${Spacing.small}px;
  border-radius: 4px;
  background-color: ${props => props.color};
`

export const Tag = styled.View`
  padding: ${Spacing.xsmall}px;
  border-radius: 4px;
  background-color: ${props => props.color};
`

Label.propTypes = {
  color: PropTypes.string.isRequired
}

export const FormInput = styled.TextInput.attrs({
  placeholderTextColor: Colors.primaryText
})`
  color: ${Colors.primaryText};
  padding: ${props => props.padding}px;
  font-size: ${FontSize['small']};
  margin-bottom: ${props => props.marginBottom}px;
  margin-top: ${props => props.marginTop}px;
  ${tronWalletBorder}
  border-width: 0.5px;
`

FormInput.defaultProps = {
  marginBottom: Spacing.medium,
  marginTop: Spacing.small,
  padding: Spacing.small
}

export const FormGroup = styled.KeyboardAvoidingView`
  padding: ${Spacing.big}px;
  ${props => props.background && css`background-color: ${props.background};`}
`
export const Error = styled.Text`
  font-size: ${FontSize['small']};
  color: #ff5454;
  text-align: center;
  margin: 5px 0;
`

export const InputError = styled.Text`
font-size: ${FontSize['xsmall']};
  color: #ff5454;
  margin-bottom: ${props => props.marginBottom}px;
`

InputError.defaultProps = {
  marginBottom: Spacing.small
}

export const PasteButton = styled.TouchableOpacity`
  margin-horizontal: 5px;
  /* padding: ${Spacing.medium - 5}px; */
  padding: ${Spacing.small}px;
  border-width: 1px;
  ${tronWalletBorder}
`
export const PlusButton = styled.TouchableOpacity`
  background-color: ${Colors.secondaryText};
  ${tronWalletBorder}
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
`
export const CloseButton = styled.TouchableOpacity`
  ${tronWalletBorder}
  margin-right: 15px;
`

export const PickerInput = styled.Picker`
  ${tronWalletBorder}
  border-width: 0.5px;
  color: ${Colors.primaryText};
  height: 50px;
  width: 100px;
`;

export const ButtonWrapper = styled.TouchableOpacity`
  position: ${props => props.absolute ? 'absolute' : 'relative'};
  align-self: ${props => props.alignSelf || 'auto'};
  padding-vertical: ${Spacing.xsmall}px;
  padding-horizontal: ${Spacing.small}px;
  justify-content: center;
  align-items: center;
  ${props => props.side && `${props.side}: ${Spacing.medium}`};
  ${props => props.marginBottom && css`margin-bottom: ${Spacing[props.marginBottom]}px;`};
`
ButtonWrapper.propTypes = {
  marginBottom: PropTypes.oneOf(['xsmall', 'small', 'medium', 'big', 'large']),
  side: PropTypes.oneOf(['right', 'left'])
}

export const Button = ({ secondary, ...props }) => (
  <ButtonWrapper onPress={props.onPress}>
    <Text secondary={secondary}>{props.children}</Text>
  </ButtonWrapper>
)

export const Card = styled.View`
  padding: ${props => Spacing[props.paddingSize]}px;
  background-color: ${Colors.darkerBackground};
  width: 100%;
  border-radius: 6px;
`
export const TransactionCard = styled.View`
  padding-top: ${Spacing.medium};
  background-color: ${Colors.background};
  width: 100%;
  border-radius: 6px;
`

Card.defaultProps = {
  paddingSize: 'medium'
}

export const NumKeyWrapper = styled.View`
  flex-basis: 33%;
  flex-grow: 1;
  padding: ${Spacing.xsmall}px;
  align-items: stretch;
  justify-content: center;
  ${props => props.double && css`
    flex-basis: 66%;
    flex-grow: 2;
  `}
`

export const NumKey = styled.TouchableOpacity`
  ${props => props.double && css`
    flex-direction: row;
    justify-content: center;
  `}
  align-items: center;
  padding: ${Spacing.medium}px;
  background-color: ${tint(0.9, Colors.background)};
`

export const NumPadWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: ${Spacing.xsmall}px;
`
