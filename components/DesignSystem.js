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
  yellow: '#F5FF30',
  green: '#a9ff68',
  RGB: {
    background: '25,26,42',
    darkerBackground: '16,16,26',
    primaryText: '255,255,255',
    secondaryText: '102,104,143'
  }
}

const { width } = Dimensions.get('window')

const getAdjustedFontSize = (size) => parseInt(size) * width * (1.8 - 0.002 * width) / 400

export const FontSize = {
  xsmall: getAdjustedFontSize(12),
  small: getAdjustedFontSize(16),
  medium: getAdjustedFontSize(24),
  large: getAdjustedFontSize(36)
}
