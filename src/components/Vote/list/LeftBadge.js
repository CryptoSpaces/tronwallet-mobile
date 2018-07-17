import React from 'react'
import PropTypes from 'prop-types'

import * as Utils from '../../Utils'
import { Colors } from '../../DesignSystem'

const LeftBadge = ({index, voted}) => (
  <Utils.LeftBadge style={{ backgroundColor: voted ? Colors.primaryGradient[0] : Colors.lighterBackground }}>
    <Utils.Text size='small' align='right'>#{index}</Utils.Text>
  </Utils.LeftBadge>
)

LeftBadge.propTypes = {
  index: PropTypes.number,
  voted: PropTypes.bool
}

export default LeftBadge
