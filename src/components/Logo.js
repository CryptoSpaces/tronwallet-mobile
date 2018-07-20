import React from 'react'

import * as Utils from './Utils'

const Logo = () => (
  <Utils.CenteredSection>
    <Utils.Logo source={require('../assets/login-circle.png')} />
    <Utils.LogoText>TRONWALLET</Utils.LogoText>
  </Utils.CenteredSection>
)

export default Logo
