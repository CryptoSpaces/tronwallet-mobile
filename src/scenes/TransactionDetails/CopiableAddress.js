import React, { PureComponent } from 'react'
import { TouchableOpacity, Clipboard } from 'react-native'

class Copiable extends PureComponent {
  state = {
    text: ''
  }

  static getDerivedStateFromProps = (nextProps) => ({
    text: nextProps.children
  })

  _onCopy = async () => {
    const { showToast } = this.props
    try {
      const { text } = this.state
      await Clipboard.setString(text)
      showToast('Public Key copied to the clipboard')
    } catch (error) {
      showToast('Something wrong while copying')
    }
  }

  _renderText = () => {
    const { TextComponent } = this.props
    const { text } = this.state
    return <TextComponent>{text}</TextComponent>
  }

  render () {
    return (
      <TouchableOpacity onPress={this._onCopy}>
        {this._renderText()}
      </TouchableOpacity>
    )
  }
}

export default Copiable
