import { View, TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import * as Utils from './Utils'
import { Colors } from './DesignSystem'

export const CardRow = ({ label, value }) => (
  <View style={{ flexDirection: 'row', paddingHorizontal: '5%', paddingVertical: '2%' }}>
    <Utils.Text size='xsmall'>{label}:</Utils.Text>
    <Utils.Text size='xsmall' style={{ paddingLeft: '2%' }}>{value}</Utils.Text>
  </View>
)

class Card extends Component {
  constructor (props) {
    super()
  }

  renderInput = () => {
    const { isEditable } = this.props

    if (isEditable) {
      return (
        <View style={{ backgroundColor: 'white', width: '100%', paddingHorizontal: '5%', marginBottom: '5%' }} >
          <Utils.Text size='xsmall' secondary style={{ paddingTop: '3%' }}>Freeze Amount</Utils.Text>
          <Utils.FormInput value={this.props.value} style={{ width: '100%', color: Colors.secondaryText }} underlineColorAndroid='transparent' keyboardType='numeric' onChangeText={(value) => this.props.onChange(value)} />
        </View>
      )
    }

    return null
  }

  render () {
    const { buttonLabel, children, onPress } = this.props
    return (
      <View style={{ width: '100%', backgroundColor: '#5E6183', flex: 1, justifyContent: 'flex-start', alignItems: 'flex-start', marginTop: '3%' }}>
        { this.renderInput() }

        {children}

        <View style={{ width: '100%', alignItems: 'center', justifyContent: 'center', marginTop: '5%', backgroundColor: 'transparent', height: 55 }}>
          <TouchableOpacity style={{ backgroundColor: 'white', width: '80%', alignItems: 'center', justifyContent: 'center', height: 45, marginBottom: '2%' }} onPress={onPress} >

            <Utils.Text size='xsmall' secondary style={{ marginBottom: '2%' }}>{buttonLabel}</Utils.Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

export default Card
