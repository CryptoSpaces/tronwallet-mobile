import React from 'react'

import * as Utils from './Utils'

const Logo = () => (
  <Utils.Content justify='center' align='center'>
    <Utils.Logo source={require('../assets/login-circle.png')} />
    <Utils.LogoText>TRONWALLET</Utils.LogoText>
  </Utils.Content>
)

export default Logo
