import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import { TransitionMotion, spring } from 'react-motion'

const willLeave = () => ({ left: spring(0), opacity: spring(0.5) })

const willEnter = () => ({ left: spring(-300), opacity: spring(0.5) })

const getStyles = () => ({ left: spring(0), opacity: spring(1) })

const getDefaultStyles = () => ({ left: -300, opacity: 0.5 })

class SlideIn extends Component {
  render () {
    const { name, children } = this.props
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

export default SlideIn
