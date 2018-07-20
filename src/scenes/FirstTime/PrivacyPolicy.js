import React from 'react'
import { TouchableOpacity } from 'react-native'

import * as Utils from '../../components/Utils'

const PrivacyPolicy = ({navigation}) => (
  <Utils.FloatingBottomContent>
    <TouchableOpacity onPress={() => { }}>
      <Utils.WarningText>
        PRIVACY POLICY
      </Utils.WarningText>
    </TouchableOpacity>
  </Utils.FloatingBottomContent>
)

export default PrivacyPolicy
