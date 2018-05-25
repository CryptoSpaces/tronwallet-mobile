import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select, Option } from 'react-native-chooser'

import { Colors, FontSize } from './DesignSystem'

class DropdownModal extends Component {
  static propTypes = {
    width: PropTypes.string,
    fontSize: PropTypes.number,
    color: PropTypes.string,
    options: PropTypes.array,
    onSelect: PropTypes.func
  }

  static defaultProps = {
    width: '90%',
    fontSize: FontSize.medium,
    color: 'white',
    options: [],
    onSelect: () => {}
  }

  state = {
    selectedValue: { name: '', value: '' },
    modalVisible: false
  }

  onSelect = (value, label) => {
    const selectedValue = { value, name: label }
    this.props.onSelect(selectedValue)
  }

  setModalVisible = (modalVisible) => {
    this.setState({ modalVisible })
  }

  renderOption = (option) => {
    const optionStyle = { borderWidth: 0, borderBottomWidth: 1, borderColor: Colors.secondaryText }
    const optionStyleText = { color: 'white' }

    return (
      <Option
        key={option.value}
        style={optionStyle}
        styleText={optionStyleText}
        value={option.value}
      >{option.name}</Option>
    )
  }

  render () {
    const { fontSize, color, options, label } = this.props
    const optionListStyle = {
      backgroundColor: 'rgba(0,0,0,.9)',
      borderColor: Colors.secondaryText
    }

    return (
      <Select
        onSelect={this.onSelect}
        defaultText={label}
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
        optionListStyle={optionListStyle}
        backdropStyle={{
          transform: [{ translateY: 20 }],
          maxHeight: 300
        }}
      >
        {options.map(this.renderOption)}
      </Select>
    )
  }
}

export default DropdownModal
