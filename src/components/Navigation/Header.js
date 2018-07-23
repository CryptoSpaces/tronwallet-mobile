import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import { Colors } from '../DesignSystem'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'

import * as Utils from '../Utils'

class NavigationHeader extends React.Component {
  /*
     onClose = Right Button with X
     onBack = Left Button with <
     onSearch = Right Button with magnifying glass
   */
  static propTypes = {
    title: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    onBack: PropTypes.func,
    onSearch: PropTypes.func,
    noBorder: PropTypes.bool,
    rightButton: PropTypes.element,
    leftButton: PropTypes.element
  }

  state = {
    isSearching: false
  }

  _renderLeftElement = (onBack, leftButton) => {
    let element = null

    if (onBack && !leftButton) {
      element = <TouchableOpacity onPress={onBack}>
        <Ionicons
          name='ios-arrow-round-back'
          size={32}
          color={Colors.primaryText}
        />
      </TouchableOpacity>
    } else {
      element = leftButton
    }
    return <Utils.View margin={10} position='absolute' left={10}>
      {element}
    </Utils.View>
  }

  _renderRightElement = (onClose, onSearch, rightButton) => {
    let element = null
    if (onClose && !rightButton) {
      element = <TouchableOpacity onPress={onClose}>
        <Feather name='x' color='white' size={28} />
      </TouchableOpacity>
    } else if (onSearch && !rightButton) {
      element = <TouchableOpacity onPress={() => { this.setState({ isSearching: true }) }}>
        <Ionicons name='ios-search' color='white' size={21} />
      </TouchableOpacity>
    } else {
      element = rightButton
    }
    return <Utils.View margin={10} position='absolute' right={10}>
      {element}
    </Utils.View>
  }

  _renderDefaultMode = () => {
    const { title, onClose, rightButton, onBack, leftButton, onSearch } = this.props

    return (
      <React.Fragment>
        {this._renderLeftElement(onBack, leftButton)}
        <Utils.View justify='center' align='center' >
          <Utils.Text lineHeight={36} size='average' font='medium'>{title.toUpperCase()}</Utils.Text>
        </Utils.View >
        {this._renderRightElement(onClose, onSearch, rightButton)}
      </React.Fragment>
    )
  }

  _renderSeachMode = () => {
    const { onSearch } = this.props

    const onClose = () => { this.setState({ isSearching: false }) }
    const searchBar = (
      <Utils.View justify='center' align='center'>
        <Utils.FormInput
          autoCapitalize='none'
          autoCorrect={false}
          underlineColorAndroid='transparent'
          onChangeText={text => onSearch(text)}
          placeholder='Search'
          placeholderTextColor='#fff'
          width={281}
          height={42}
        />
      </Utils.View>
    )

    return (
      <React.Fragment>
        {this._renderLeftElement(null, searchBar)}
        {this._renderRightElement(onClose)}
      </React.Fragment>
    )
  }

  render () {
    const { noBorder } = this.props
    const { isSearching } = this.state

    return (
      <Utils.Header padding={16} justify='center' noBorder={noBorder}>
        {isSearching ? this._renderSeachMode() : this._renderDefaultMode()}
      </Utils.Header>
    )
  }
}

export default NavigationHeader
