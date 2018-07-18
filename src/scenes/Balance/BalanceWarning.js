import React from 'react'
import { TouchableOpacity } from 'react-native'
import PropTypes from 'prop-types'
import styled from 'styled-components'

import * as Utils from '../../components/Utils'
import { Colors, FontSize, Spacing } from '../../components/DesignSystem'

const Warning = styled.Text`
  align-self: center;
  color: ${Colors.secondaryText};
  font-size: ${FontSize.xsmall};
  paddingVertical: ${Spacing.small}px;
  paddingHorizontal: ${Spacing.medium}px;
  border: 1px solid ${Colors.secondaryText};
  letter-spacing: 1px;
  border-radius: 4px;
`

const BalanceWarning = ({children, navigation, seed}) => (
  <React.Fragment>
    <Utils.VerticalSpacer size='medium' />
    <TouchableOpacity onPress={() => {
      navigation.navigate('SeedConfirm', { seed })
    }}>
      <Warning>
        {children}
      </Warning>
    </TouchableOpacity>
  </React.Fragment>
)

BalanceWarning.propTypes = {
  children: PropTypes.string.isRequired
}

export default BalanceWarning
