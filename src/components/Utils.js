/* eslint-disable prettier */
import React from 'react'
import styled, { css } from 'styled-components'
import { ImageBackground, Image, Platform } from 'react-native'
import _ from 'lodash'
import Ionicon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types'

import { Colors, Spacing, FontSize } from './DesignSystem'

/* Tron Wallet's border settings. Use it anywhere you need the default Tron Wallet
border. */
const tronWalletBorder = css`
  border-width: 1px;
  border-color: ${Colors.secondaryText};
  border-radius: 5px;
`

export const Header = styled.View`
  height: 64px;
  flex-direction: row;
  align-items: center;
  justify-content: ${props => props.justify};
  padding: ${Spacing.medium}px;
  background-color: ${props => props.background};
  ${props => props.position && css`position: ${props.position}`};
  ${props => props.paddingTop && css` padding-top: ${props.paddingTop}px`};
`

Header.defaultProps = {
  background: Colors.background,
  justify: 'space-between'
}

export const Title = styled.Text`
  color: white;
  font-weight: 700;
  font-size: ${FontSize.medium};
`

Title.defaultProps = {
  paddingLeft: 'medium'
}

export const TitleWrapper = styled.View`
  justify-content: ${props => props.justify};
  align-items: ${props => props.align};
`

TitleWrapper.defaultProps = {
  justify: 'center',
  align: 'flex-start'
}

export const View = styled.View`
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  ${props => props.flex && css`flex: ${props.flex}`};
  ${props => props.height && css`height: ${props.height}`};
  ${props => props.width && css`width: ${props.width}`};
  ${props => props.background && css`background-color: ${props.background}`};
  ${props => props.borderWidth && css`border-width: ${props.borderWidth}`};
  ${props => props.borderColor && css`border-color: ${props.borderColor}`};
  ${props => props.borderRadius && css`border-radius: ${props.borderRadius}px`};
  ${props => props.paddingY && css`padding-vertical: ${Spacing[props.paddingY]}`};
  ${props => props.paddingX && css`padding-horizontal: ${Spacing[props.paddingX]}`};
  ${props => props.padding && css`padding: ${props.padding}px`};
  ${props => props.margin && css`margin: ${props.margin}px`};
  ${props => props.marginY && css`margin-vertical: ${props.marginY}px`};
  ${props => props.marginTop && css`margin-top: ${props.marginTop}px`};
  ${props => props.marginBottom && css`margin-bottom: ${props.marginBottom}px`};
  ${props => props.marginRight && css`margin-right: ${props.marginRight}px`};
  ${props => props.marginLeft && css`margin-left: ${props.marginLeft}px`};
  ${props => props.marginLeftPercent && css`margin-left: ${props.marginLeftPercent}%`};
  ${props => props.position && css`position: ${props.position}`};
  ${props => props.top && css`top: ${props.top}`};
  ${props => props.bottom && css`bottom: ${props.bottom}`};
  ${props => props.right && css`right: ${props.right}`};
  ${props => props.left && css`left: ${props.left}`};
`

View.defaultProps = {
  align: 'stretch',
  justify: 'flex-start'
}

View.propTypes = {
  align: PropTypes.oneOf([
    'stretch',
    'center',
    'flex-start',
    'flex-end',
    'baseline'
  ]),
  justify: PropTypes.oneOf([
    'flex-start',
    'flex-end',
    'center',
    'space-between',
    'space-around',
    'space-evenly'
  ]),
  position: PropTypes.oneOf(['absolute', 'relative']),
  paddingX: PropTypes.oneOf(['xsmall', 'small', 'medium', 'big', 'large']),
  flex: PropTypes.number
}

export const Container = View.extend.attrs({
  flex: 1,
  background: Colors.background
})``

export const Content = styled(View)`
  padding-vertical: ${props => props.paddingVertical ? Spacing[props.paddingVertical] : Spacing[props.paddingSize]};
  padding-horizontal: ${props => props.paddingHorizontal ? Spacing[props.paddingHorizontal] : Spacing[props.paddingSize]};
  ${props => props.flex && css` flex: ${props.flex}`};
  ${props => props.background && css` background-color: ${props.background}`};
  ${props => props.paddingTop && css` padding-top: ${props.paddingTop}px`};
  ${props => props.paddingBottom && css` padding-bottom: ${props.paddingBottom}px`};
  ${props => props.position && css` position: ${props.position}`};
`

Content.defaultProps = {
  paddingSize: 'large'
}

export const StatusBar = styled.View`
  height: 12px;
  background-color: ${Colors.background};
  ${props => props.transparent && css` background-color: transparent`};
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

export const Img = View.withComponent(Image)

export const Row = View.extend`
  flex-direction: row;
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  ${props => props.background && css` background-color: ${props.background}`};
  ${props => props.position && css` position: ${props.position}`};
  ${props => props.wrap && css` flex-wrap: ${props.wrap}`};
  ${props => props.marginRight && css` margin-right: ${props.marginRight}px`};
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
  size: PropTypes.oneOf(['tiny', 'xsmall', 'small', 'medium', 'big', 'large'])
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
  color: ${props => props.color};
  font-family: ${props => `Rubik-${_.capitalize(props.font || 'medium')}`};
  ${props => props.size && css` font-size: ${FontSize[props.size]}px`};
  ${props => props.light && css` font-family: rubik-light`};
  ${props => props.padding && css` padding: ${props.padding}px`};
  ${props => props.weight && css` font-weight: ${props.weight}`};
  ${props => props.marginY && css` margin-vertical: ${props.marginY}px`};
  ${props => props.marginX && css` margin-horizontal: ${props.marginX}px`};
  ${props => props.align && css` text-align: ${props.align}`};
  ${props => props.secondary && css` color: ${Colors.secondaryText}`};
  ${props => props.success && css` color: ${Colors.green}`};
  ${props => props.lineHeight && css` line-height: ${props.lineHeight}`};
  ${props => props.letterSpacing && css` letter-spacing: ${props.letterSpacing}`};
  ${props => props.marginBottom && css` margin-bottom: ${props.marginBottom}px`};
  ${props => props.marginTop && css` margin-top: ${Spacing[props.marginTop]}px`};
  ${props => props.margin && css` margin: ${props.margin}px`};
  ${props => props.position && css` position: ${props.position}`};
  ${props => props.top && css` top: ${props.top}`};
  ${props => props.background && css` background-color: ${props.background}`};
`

Text.defaultProps = {
  size: 'small',
  color: Colors.primaryText
}

Text.propTypes = {
  size: PropTypes.oneOf([
    'tiny',
    'xsmall',
    'smaller',
    'small',
    'button',
    'average',
    'medium',
    'large',
    'huge'
  ]),
  marginTop: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  lineHeight: PropTypes.number,
  font: PropTypes.oneOf(['bold', 'light', 'black', 'medium', 'regular'])
}

export const Item = styled.View`
  ${props => props.padding && css` padding: ${props.padding}px`};
  border-color: ${Colors.secondaryText};
  ${props => props.borderColor && css` border-color: ${props.borderColor}`};
  border-bottom-width: 0.2px;
  ${props => props.top && css` border-top-width: 0.2px`};
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
  ${props => props.height && css`height: ${props.height}px`};
  color: ${Colors.primaryText};
  padding: ${props => props.padding}px;
  font-size: ${FontSize['small']};
  margin-bottom: ${props => props.marginBottom}px;
  margin-top: ${props => props.marginTop}px;
  ${tronWalletBorder} border-width: 0.5px;
`

FormInput.defaultProps = {
  marginBottom: Spacing.medium,
  marginTop: Spacing.small,
  padding: Spacing.small
}

export const FormGroup = styled.KeyboardAvoidingView`
  padding: ${Spacing.big}px;
  ${props => props.background && css` background-color: ${props.background}`};
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

export const Warning = Error.extend`
  color: ${Colors.orange};
`

export const PasteButton = styled.TouchableOpacity`
  margin-horizontal: 5px;
  padding: ${Spacing.small}px;
  border-width: 1px;
  ${tronWalletBorder}
`
export const PlusButton = styled.TouchableOpacity`
  background-color: ${Colors.secondaryText};
  ${tronWalletBorder} height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
`
export const CloseButton = styled.TouchableOpacity`
  ${tronWalletBorder} margin-right: 15px;
`

export const PickerInput = Platform.select({
  android: styled.Picker`
    ${tronWalletBorder} border-width: 0.5px;
    color: ${Colors.primaryText};
    height: 50px;
    width: 150px;
  `,
  ios: styled.Picker.attrs({
    itemStyle: { color: Colors.primaryText, height: 50 },
    style: { height: 50 }
  })``
})

export const ButtonWrapper = styled.TouchableOpacity`
  position: ${props => (props.absolute ? 'absolute' : 'relative')};
  align-self: ${props => props.alignSelf || 'auto'};
  padding-vertical: ${Spacing.xsmall};
  padding-horizontal: ${Spacing.small};
  justify-content: center;
  align-items: center;
  ${props => props.side && `${props.side}: ${Spacing.medium}`};
  ${props => props.marginBottom && css` margin-bottom: ${Spacing[props.marginBottom]}px`};
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
export const TransactionCard = styled.TouchableOpacity`
  padding-top: ${Spacing.medium};
  background-color: ${Colors.background};
  width: 100%;
  border-radius: 6px;
`

Card.defaultProps = {
  paddingSize: 'medium'
}

/* Vote Components */
export const VoteRow = styled.View`
  borderBottomWidth: 2px;
  borderBottomColor: ${Colors.lighterBackground};
  marginRight: ${Spacing.large};
`
export const LeftBadge = styled.View`
  justify-content: center;
  backgroundColor: ${Colors.lighterBackground};
  borderBottomRightRadius: 8px;
  borderTopRightRadius: 8px;
  width: 80px;
  height: 35px;
  marginVertical: 20px;
  paddingRight: 15px;
  marginRight: 20px;
`
export const NumKeyWrapper = styled.View`
  flex-grow: 1;
  padding: ${Spacing.xsmall}px;
  align-items: stretch;
  justify-content: center;
  ${props => props.flexBasis && css` flex-basis: ${props.flexBasis}%`};
  ${props => props.double && css`flex-basis: 66%; flex-grow: 2;`};
  ${props => props.disabled && css`opacity: 0.2`}
`
export const NumKey = styled.TouchableOpacity`
  ${props =>
    props.double && css`
      flex-direction: row;
      justify-content: center;
    `}
  align-items: center;
  padding: ${Spacing.small}px;
  background-color: ${Colors.lightestBackground};
  border-radius: 4px;
  border-width: 0.5px;
  border-color:  ${Colors.lightestBackground};
`

export const BorderButton = styled.TouchableOpacity`
  ${props => props.background && css`background-color: ${props.background}`};
  align-items: center;
  padding-vertical: 12px;
  padding-horizontal: ${Spacing.small}px;
  border-radius: 4px;
  border-width: 3px;
  ${props => css`border-color: ${props.disabled ? Colors.lightestBackground
    : Colors.lightPurple}`};
`

export const NumPadWrapper = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  margin: ${Spacing.xsmall}px;
`

/* Form Input controls that follow the design scheme of
the project. */
export const InputContainer = styled.View`
  height: 90px;
  justify-content: center;
  position: relative;
`

export const InputBorderContainer = Row.extend`
  ${tronWalletBorder} position: relative;
  align-items: center;
  height: 70px;
  padding: 10px;
`

export const RevisedFormInput = styled.TextInput.attrs({
  placeholderTextColor: Colors.secondaryText
})`
  position: relative;
  text-align: ${props => props.align};
  font-size: ${props => FontSize[props.size]};
  height: 70px;
  color: ${Colors.primaryText};
  flex: 1;
  ${props => props.letterSpacing && `letter-spacing: ${props.letterSpacing}px`};
`

RevisedFormInput.defaultProps = {
  size: 'average',
  align: 'left'
}

export const FormIcon = styled(Ionicon)`
  padding-horizontal: ${Spacing.small};
  color: ${Colors.lightestBackground};
`

export const FormButton = styled.TouchableOpacity`
  background-color: ${Colors.lighterBackground};
  padding: 12px;
  border-radius: 4px;
  elevation: 15;
  shadow-color: black;
  shadow-offset: 4px 4px;
  shadow-opacity: 0.25;
  shadow-radius: 4px;
`

export const FormLabel = styled.Text`
  font-family: Rubik-Bold;
  position: absolute;
  left: 5px;
  padding: 5px;
  top: -5px;
  background-color: ${Colors.background};
  color: ${Colors.secondaryText};
  z-index: 1;
`

export const SummaryInfo = styled.Text`
  color: ${Colors.summaryText};
  font-weight: 500;
`

export const LightButton = styled.TouchableOpacity`  
  align-items: center;
  ${props => props.paddingY && css`padding-vertical: ${Spacing[props.paddingY]}`};
  ${props => props.paddingX && css`padding-horizontal: ${Spacing[props.paddingX]}`};
  background-color: ${props => props.disabled ? Colors.background : Colors.lightestBackground};
  border-radius: 4px;
  border-width: 2px;
  border-color:  ${Colors.lightestBackground};
`
/* Text components used throughout the app: */

export const BoldText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 18px;
  line-height: 36px;
  color: ${Colors.primaryText};
`
export const SectionTitle = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: 0.6px;
  color: ${Colors.titleLabel};
`
export const RegularText = styled.Text`
  padding-top: 10px;
  font-family: Rubik-Regular;
  font-weight: 100;
  font-size: 13px;
  line-height: 20px;
  color: ${Colors.primaryText};
`
export const SmallRegText = RegularText.extend`
  font-size: 12px;
`
