import React from 'react'
import { Image } from 'react-native'

import * as Utils from './Utils'

const Logo = () => (
  <Utils.Content justify='center' align='center'>
    <Utils.VerticalSpacer size='small' />
    <Image source={require('../assets/login-circle.png')} />
    <Utils.VerticalSpacer size='small' />
    <Utils.Text size='medium'>TRONWALLET</Utils.Text>
  </Utils.Content>
)

export default Logo
