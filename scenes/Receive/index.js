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
  state = { accountSelected: null }

  componentDidMount () {
    this.loadAccountsBalance()
  }

  loadAccountsBalance = () => {
    const accountSelected = receiveInfo.accounts[0]
    const options = this.mapAccountsToDropdownOptions(receiveInfo.accounts)

    this.setState({ accountSelected, options })
  }

  mapAccountsToDropdownOptions = (accounts) => {
    return accounts.map((account) => ({ name: account, value: account }))
  }

  onSelect = (selectedValue) => {
    this.setState({ accountSelected: selectedValue.value })
  }

  render () {
    const { width } = Dimensions.get('window')
    const { accountSelected, options } = this.state

    return (
      <Container>
        <Content align='center'>
          <VerticalSpacer size='large' />
          <Text size='xsmall' secondary>Account balance:</Text>
          <DropdownModal label={accountSelected} options={options} onSelect={this.onSelect} />
          <VerticalSpacer size='medium' />
        </Content>
        <Content align='center'>
          {!!accountSelected && (
            <QRCode
              value={accountSelected}
              size={width * 0.6}
            />
          )}
        </Content>
      </Container>
    )
  }
}

export default ReceiveScreen
