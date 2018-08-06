import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'

import ButtonIconGradient from '../../components/ButtonIconGradient'

import { Colors } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'

const ICON_COLOR = Colors.primaryText
const ICON_SIZE = 22

const BalanceNavigation = ({ navigation }) => {
  const goToReceive = () => {
    navigation.navigate('ReceiveScene')
  }

  const navigateNext = next => navigation.navigate(next, {index: 0})

  return (
    <React.Fragment>
      <Utils.VerticalSpacer size='xsmall' />
      <Utils.Row>
        <ButtonIconGradient
          text='PAY'
          icon={<Ionicons
            name='ios-card-outline'
            size={ICON_SIZE}
            color={ICON_COLOR}
          />}
          full
          onPress={() => navigateNext('PayScene')}
        />
        <ButtonIconGradient
          text='SEND'
          full
          icon={<Ionicons
            name='ios-paper-plane-outline'
            size={ICON_SIZE}
            color={ICON_COLOR}
          />}
          onPress={() => navigateNext('SendScene')}
        />
        <ButtonIconGradient
          text='RECEIVE'
          full
          icon={<Ionicons
            name='ios-qr-scanner-outline'
            size={ICON_SIZE}
            color={ICON_COLOR}
          />}
          onPress={goToReceive}
        />
        <ButtonIconGradient
          text='FREEZE'
          multiColumnButton={{x: 2, y: 3}}
          full
          icon={<Ionicons
            name='ios-snow'
            size={ICON_SIZE}
            color={ICON_COLOR}
          />}
          onPress={() => navigateNext('FreezeScene')}
        />
      </Utils.Row>
    </React.Fragment>
  )
}

export default BalanceNavigation
