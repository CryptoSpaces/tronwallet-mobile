import React from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'
import LinearGradient from 'react-native-linear-gradient'
import RNQRCode from 'react-native-qrcode'
import { Colors } from './DesignSystem'

const QRCode = ({ size, value, bgColor, fgColor }) => (
  <View
    style={{
      padding: 10,
      backgroundColor: bgColor,
      borderRadius: 10
    }}
  >
    <LinearGradient
      start={{x: 0, y: 1}}
      end={{x: 1, y: 0}}
      colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
      style={{ padding: 1, borderRadius: 10 }}
    >
      <View
        style={{
          padding: 15,
          backgroundColor: bgColor,
          borderRadius: 10
        }}
      >
        <View
          style={{
            padding: 5,
            backgroundColor: fgColor,
            borderRadius: 10
          }}
        >
          <RNQRCode
            value={value}
            size={size}
            bgColor={bgColor}
            fgColor={fgColor}
          />
        </View>
      </View>
    </LinearGradient>
  </View>
)

QRCode.propTypes = {
  size: PropTypes.number.isRequired,
  value: PropTypes.string.isRequired,
  bgColor: PropTypes.string,
  fgColor: PropTypes.string
}

QRCode.defaultProps = {
  bgColor: Colors.darkerBackground,
  fgColor: '#ededed'
}

export default QRCode
