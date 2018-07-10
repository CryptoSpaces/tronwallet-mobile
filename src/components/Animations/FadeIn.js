import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import { TransitionMotion, spring, presets } from 'react-motion'

const willLeave = () => ({ opacity: spring(0, presets.gentle) })

const willEnter = () => ({ opacity: 0 })

const getStyles = () => ({ opacity: spring(1, presets.gentle) })

const getDefaultStyles = () => ({ opacity: 0 })

class FadeIn extends Component {
  render () {
    const { name, children, didLeave } = this.props
    return (
      <TransitionMotion
        defaultStyles={
          children ? [{ key: name, style: getDefaultStyles() }] : []
        }
        styles={
          children ? [{ key: name, style: getStyles(), data: children }] : []
        }
        willLeave={willLeave}
        willEnter={willEnter}
        didLeave={didLeave}
      >
        {int => (
          <Fragment>
            {int.map(({ key, style }) => (
              <View key={key} style={style}>
                {children}
              </View>
            ))}
          </Fragment>
        )}
      </TransitionMotion>
    )
  }
}

export default FadeIn
