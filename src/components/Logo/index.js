import React from 'react'

import { LogoWrapper, LogoText } from './elements'
import { CenteredSection } from '../Utils'

const Logo = () => (
  <CenteredSection>
    <LogoWrapper source={require('../../assets/login-circle.png')} />
    <LogoText>TRONWALLET</LogoText>
  </CenteredSection>
)

export default Logo
