import React, { Component } from 'react'
import { Text } from '../Utils'

export default class ErrorBoundary extends Component {
  state = {
    error: false,
    message: ''
  }

  componentDidCatch () {
    this.setState({ error: true })
  }

  render () {
    if (this.state.error) {
      console.log('Error: ', this.state.error, this.state.info)
      return <Text>Something went wrong, please try again</Text>
    }
    return this.props.children
  }
}
