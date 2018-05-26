import styled, { css } from 'styled-components'
import { ImageBackground } from 'react-native'
import PropTypes from 'prop-types'
import { Constants } from 'expo'

import { Colors, Spacing, FontSize } from './DesignSystem'

export const View = styled.View`
  align-items: ${props => props.align};
  justify-content: ${props => props.justify};
  ${props => props.flex && css`flex: ${props.flex};`};
  ${props => props.height && css`height: ${props.height}px;`};
  ${props => props.width && css`width: ${props.width}px;`};
`

View.defaultProps = {
  align: 'stretch',
  justify: 'flex-start'
}

View.propTypes = {
  align: PropTypes.oneOf(['stretch', 'center', 'flex-start', 'flex-end', 'baseline']),
  justify: PropTypes.oneOf(['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly']),
  flex: PropTypes.number
}

export const Container = styled.ScrollView`
  flex: 1;
  background-color: ${Colors.background};
  ${props => props.darker && css`background-color: ${Colors.darkerBackground};`}
`

export const Content = View.extend`
  padding: ${Spacing.big}px;
  ${props => props.background && css`background-color: ${props.background};`}
`

export const StatusBar = styled.View`
  height: ${Constants.statusBarHeight};
  background-color: ${Colors.background};
  ${props => props.transparent && css`background-color: transparent;`}
`

export const ContentWithBackground = Content.withComponent(ImageBackground)

export const Row = View.extend`
  flex-direction: row;
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
  font-family: rubik-medium;
  color: ${Colors.primaryText};
  font-size: ${props => FontSize[props.size]};
  ${props => props.font && css`font-family: rubik-${props.font}`};
  ${props => props.secondary && css`color: ${Colors.secondaryText};`}
  ${props => props.success && css`color: ${Colors.green};`}
  ${props => props.lineHeight && css`line-height: ${props.lineHeight};`}
`

Text.defaultProps = {
  size: 'small'
}

Text.propTypes = {
  size: PropTypes.oneOf(['xsmall', 'small', 'medium', 'large']),
  lineHeight: PropTypes.number,
  font: PropTypes.oneOf(['bold', 'light', 'medium'])
}

export const Item = styled.View`
  ${props => props.padding && css`padding: ${props.padding}px`};
  border-color: ${Colors.secondaryText};
  ${props => props.borderColor && css`border-color: ${props.borderColor}`};
  border-bottom-width: 0.2px;
  ${props => props.lineWidth && css`border-bottom-width: ${props.lineWidth}px`};
`

export const Label = styled.View`
  padding: ${Spacing.small}px;
  border-radius: 4px;
  background-color: ${props => props.color};
`

Label.propTypes = {
  color: PropTypes.string.isRequired
}

export const FormInput = styled.TextInput`
  color: ${Colors.primaryText};
  padding: ${Spacing.small}px;
  font-size: ${FontSize['small']};
  margin-bottom: ${Spacing.medium}px;
  border-bottom-width: 0.5px;
  border-bottom-color: ${Colors.secondaryText};
`

export const FormGroup = styled.KeyboardAvoidingView`
padding: ${Spacing.big}px;
${props => props.background && css`background-color: ${props.background};`}
`
export const Error = styled.Text`
  font-size: ${FontSize['small']};
  color: #ff5454;
  text-align:center;
  margin-bottom: ${Spacing.small}px;
`
export const InputError = styled.Text`
font-size: ${FontSize['xsmall']};
  color: #ff5454;
  margin-bottom: ${Spacing.small}px;
`
export const PasteButton = styled.TouchableOpacity`
  margin-horizontal: 5px;
  padding:${Spacing.small}px;
  border-radius: 5px;
  border-width:1px;
  borderColor: ${Colors.secondaryText};
`
export const PlusButton = styled.TouchableOpacity`
  background-color: ${Colors.secondaryText};
  border-color: ${Colors.secondaryText};
  border-radius: 5px;
  height: 20px;
  width: 20px;
  justify-content: center;
  align-items: center;
`
