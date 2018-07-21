import React, { PureComponent } from 'react'
import {
  Animated,
  TouchableOpacity,
  Easing} from 'react-native'

import { Spacing } from '../DesignSystem'

class SyncButton extends PureComponent {
  constructor () {
    super()
    this.spinValue = new Animated.Value(0)
  }

  componentDidMount () {
    this._spin()
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    const { loading } = this.props
    if (prevProps.loading !== loading) {
      if (loading) this._spin()
    }
  }

  _spin = () => {
    const { loading } = this.props
    if (!loading) return
    this.spinValue.setValue(0)
    Animated.timing(
      this.spinValue,
      {
        toValue: 1,
        duration: 900,
        easing: Easing.linear,
        useNativeDriver: true
      }
    ).start(() => this._spin())
  }

  render () {
    const { onPress, loading } = this.props
    const spin = this.spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    })

    return (
      <TouchableOpacity disabled={loading} style={{padding: Spacing.medium}} onPress={onPress}>
        <Animated.Image
          style={{
            width: 17,
            height: 17,
            opacity: loading ? 0.4 : 1,
            transform: [{rotate: spin}] }}
          source={require('../../assets/refresh.png')}
        />
      </TouchableOpacity>
    )
  }
}

export default SyncButton
