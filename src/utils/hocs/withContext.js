import React, { Component } from 'react'
import { Context } from '../../store/context'

const withContext = (WrappedComponent) => {
  return class extends Component {
    static navigationOptions = WrappedComponent.navigationOptions

    render () {
      return (
        <Context.Consumer>
          {context => <WrappedComponent context={context} {...this.props} />}
        </Context.Consumer>
      )
    }
  }
}

export default withContext
