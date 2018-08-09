import React from 'react'
import { StyleSheet, TouchableOpacity } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import PropTypes from 'prop-types'

import tl from '../../utils/i18n'
import { Colors, Spacing, ButtonSize } from '../DesignSystem'
import * as Utils from '../Utils'

const FloatingConfirm = ({onPress, disabled, voteCount}) => (
  <Utils.View position='absolute' bottom={10} left='30%' right='30%'>
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
    >
      <LinearGradient
        start={{ x: 0, y: 1 }}
        end={{ x: 1, y: 0 }}
        colors={[Colors.buttonGradient[0], Colors.buttonGradient[1]]}
        style={[styles.container, {
          opacity: disabled ? 0.4 : 1
        }]}
      >
        <Utils.Row justify='center' align='center'>
          <Utils.Text weight={'bold'} size={'xsmall'}>{tl.t('components.vote.confirmVotes')}</Utils.Text>
          <Utils.View
            align='center'
            justify='center'
            marginLeft={5}
            width={Spacing.big}
            height={Spacing.big}
            background={Colors.background}
          >
            <Utils.Text weight={'bold'} size={'xsmall'}>{voteCount}</Utils.Text>
          </Utils.View>
        </Utils.Row>
      </LinearGradient>
    </TouchableOpacity>
  </Utils.View>
)

FloatingConfirm.propTypes = {
  onPress: PropTypes.func.isRequired,
  voteCount: PropTypes.number.isRequired

}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    borderRadius: 4,
    height: ButtonSize['large'],
    paddingHorizontal: 10
  }
})

export default FloatingConfirm
