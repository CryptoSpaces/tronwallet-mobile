import React, { Component } from 'react'
import { Dimensions } from 'react-native'
import PropTypes from 'prop-types'
import SectionedMultiSelect from 'react-native-sectioned-multi-select'
import { DropdownModalStyles } from './DropdownModal.styles'

import { FontSize } from './DesignSystem'
import { View } from './Utils'

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
    modalVisible: false,
    selectedItems: []
  }

  onSelect = selectedItems => {
    this.props.onSelect(selectedItems[0])
  }

  render () {
    const {
      options,
      selectedItem,
      searchPlaceholderText,
      selectText
    } = this.props

    const { width } = Dimensions.get('window')

    return (
      <View width={width * 0.8}>
        <SectionedMultiSelect
          single
          items={options}
          uniqueKey='value'
          selectText={selectText}
          searchPlaceholderText={searchPlaceholderText}
          onSelectedItemsChange={this.onSelect}
          selectedItems={[selectedItem]}
          colors={DropdownModalStyles.colors}
          styles={DropdownModalStyles.styles}
        />
      </View>
    )
  }
}

export default DropdownModal
