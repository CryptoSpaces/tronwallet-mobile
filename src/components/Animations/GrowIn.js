import React, { Component, Fragment } from 'react'
import { View } from 'react-native'
import { TransitionMotion, spring, presets } from 'react-motion'


class GrowIn extends Component {
  willLeave = () => ({ height: spring(0, presets.gentle) })
  
  willEnter = () => ({ height: spring(0, presets.gentle) })
  
  getStyles = () => ({ height: spring(this.props.height, presets.gentle) })
  
  getDefaultStyles = () => ({ height: 0 })

  render() {
    const { name, children } = this.props
    return (
      <TransitionMotion
        defaultStyles={children ? [{ key: name, style: this.getDefaultStyles() }] : []}
        styles={children ? [{ key: name, style: this.getStyles(), data: children }] : []}
        willLeave={this.willLeave}
        willEnter={this.willEnter}
      >
        {int => (
          <Fragment>
            {int.map(({ key, style }) => (
              <View key={key} style={{
                ...style,
                overflow: 'hidden'
              }}>
                {children}
              </View>
            ))}
          </Fragment>
        )}
      </TransitionMotion>
    )
  }
}

export default GrowIn
