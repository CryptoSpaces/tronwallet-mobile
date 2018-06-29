import React, { Component } from 'react'
import AppContext from '../../AppContext'

export default (WrappedComponent) => (
    class extends React.Component {
        render() {
            return <AppContext.Consumer>
                {context => <WrappedComponent {...this.props}
                    passwordReference={context.password}
                    setPasswordReference={context.setPassword}
                />}
            </AppContext.Consumer>
        }
    }
)
