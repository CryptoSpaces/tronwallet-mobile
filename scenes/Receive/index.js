import React, { PureComponent } from 'react'
import { Dimensions } from 'react-native'

import {
  Container,
  Content,
  VerticalSpacer,
  Text
} from '../../components/Utils'
import QRCode from '../../components/QRCode'
import DropdownModal from '../../components/DropdownModal'
import receiveInfo from './receive.json'

class ReceiveScreen extends PureComponent {
  state = {}

  render () {
    const { width } = Dimensions.get('window')
    return (
      <Container>
        <Content align='center'>
          <VerticalSpacer size='large' />
          <Text size='xsmall' secondary>Account balance:</Text>
          <DropdownModal />
          <VerticalSpacer size='medium' />
        </Content>
        <Content align='center'>
          <QRCode
            value={receiveInfo.value}
            size={width * 0.6}
          />
        </Content>
      </Container>
    )
  }
}

export default ReceiveScreen
