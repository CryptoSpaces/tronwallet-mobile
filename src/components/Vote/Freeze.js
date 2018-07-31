import React from 'react'

import NavigationHeader from '../Navigation/Header'
import FreezeScene from '../../scenes/Freeze/index'

export default (props) => (
  <React.Fragment>
    <NavigationHeader
      title='FREEZE'
      onBack={() => props.navigation.goBack()}
    />
    <FreezeScene {...props} />
  </React.Fragment>
)
