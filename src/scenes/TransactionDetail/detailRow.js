import React from 'react'
import * as Utils from '../../components/Utils'

export default ({ title, text }) => (
  <Utils.Row
    style={{ justifyContent: 'space-between', marginVertical: 5 }}
  >
    <Utils.Text secondary size='xsmall'>
      {title}
    </Utils.Text>
    <Utils.Text size='xsmall'>{text}</Utils.Text>
  </Utils.Row>
)
