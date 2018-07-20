import React from 'react'

const DEFAULT_VALUE = {}

export const withContext = Component => {
  class EnhancedComponent extends React.Component {
    render () {
      return (
        <Context.Consumer>
          {context => <Component context={context} {...this.props} />}
        </Context.Consumer>
      )
    }
  }
  EnhancedComponent.navigationOptions = Component.navigationOptions
  return EnhancedComponent
}

export const Context = React.createContext(DEFAULT_VALUE)
