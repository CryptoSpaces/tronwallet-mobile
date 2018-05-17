import { Dimensions } from 'react-native'

export const Spacing = {
  xsmall: 4,
  small: 8,
  medium: 16,
  big: 24,
  large: 32
}

export const Colors = {
  background: '#191A2A',
  darkerBackground: '#10101A',
  primaryText: '#FFFFFF',
  secondaryText: '#66688F',
  primaryGradient: ['#FF4465', '#F6CA1D'],
  yellow: '#F5FF30'
}

const { width } = Dimensions.get('window')

const getAdjustedFontSize = (size) => parseInt(size) * width * (1.8 - 0.002 * width) / 400

export const FontSize = {
  xsmall: getAdjustedFontSize(14),
  small: getAdjustedFontSize(16),
  medium: getAdjustedFontSize(24),
  large: getAdjustedFontSize(36)
}
