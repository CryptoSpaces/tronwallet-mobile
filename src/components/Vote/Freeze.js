import React from 'react'

import tl from '../../utils/i18n'
import NavigationHeader from '../Navigation/Header'
import FreezeScene from '../../scenes/Freeze/index'

export default (props) => (
  <React.Fragment>
    <NavigationHeader
      title={tl.t('freeze.title')}
      onBack={() => props.navigation.goBack()}
    />
    <FreezeScene {...props} />
  </React.Fragment>
)
