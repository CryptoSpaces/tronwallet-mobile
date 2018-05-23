import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, Option } from 'react-native-chooser'

import { Colors, FontSize } from './DesignSystem'

class DropdownModal extends Component {
  static propTypes = {
    width: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string
  }

  static defaultProps = {
    width: '90%',
    fontSize: FontSize.medium,
    color: 'white'
  }

  state = {
    value: 'azhar',
    modalVisible: false
  }

  onSelect = (value, label) => {
    this.setState({ value })
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible })
  }

  render () {
    const { fontSize, color } = this.props
    const optionStyle = { borderWidth: 0, borderBottomWidth: 1, borderColor: Colors.secondaryText }
    const optionStyleText = { color: 'white' }
    return (
      <Select
        onSelect={this.onSelect}
        defaultText={this.state.value}
        style={{
          width: 300,
          borderBottomWidth: 0.5,
          borderWidth: 0,
          borderColor: Colors.secondaryText,
          alignItems: 'center'
        }}
        textStyle={{
          textAlign: 'center',
          fontSize: fontSize,
          color: color
        }}
        transparent
        animationType='fade'
        optionListStyle={{ backgroundColor: 'rgba(0,0,0,.9)', transform: [{ translateY: -125 }], borderColor: Colors.secondaryText, height: 200 }}
      >
        <Option style={optionStyle} styleText={optionStyleText} value='azhar'>Azhar</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='johnceena'>Johnceena</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='undertaker'>Undertaker</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Daniel'>Daniel</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Roman'>Roman</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Stonecold'>Stonecold</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Rock'>Rock</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Sheild'>Sheild</Option>
        <Option style={optionStyle} styleText={optionStyleText} value='Orton'>Orton</Option>
      </Select>
    )
  }
}

export default DropdownModal
