import React from 'react'
import { TouchableOpacity } from 'react-native'
import withNavigation from '../../utils/hocs/withNavigation'

import * as Utils from '../../components/Utils'

const PrivacyPolicy = ({navigation}) => (
  <Utils.FloatingBottomContent>
    <TouchableOpacity onPress={() => { console.warn(navigation) }}>
      <Utils.WarningText>
        PRIVACY POLICY
      </Utils.WarningText>
    </TouchableOpacity>
  </Utils.FloatingBottomContent>
)

export default withNavigation(PrivacyPolicy)
