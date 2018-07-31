import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { formatNumber } from '../../utils/numberUtils'
import { orderBalances } from '../../utils/balanceUtils'

import { Colors } from '../../components/DesignSystem'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

class WalletBalances extends PureComponent {
  render () {
    const { balances } = this.props

    return (
      <React.Fragment>
        <Utils.VerticalSpacer size='large' />
        <Utils.Row justify='space-between'>
          <Utils.Text size='xsmall' secondary>
            TOKENS
          </Utils.Text>
          <Utils.Text size='xsmall' secondary>
            HOLDINGS
          </Utils.Text>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        {balances && orderBalances(balances).map((item) => (
          <Utils.Content key={item.name} paddingHorizontal='none' paddingVertical='medium'>
            <Utils.Row justify='space-between'>
              <Badge bg={Colors.lightestBackground} guarantee={item.name === 'TRX' || item.name === 'TWX'}>{item.name}</Badge>
              <Utils.Text>{formatNumber(item.balance)}</Utils.Text>
            </Utils.Row>
          </Utils.Content>
        ))}
      </React.Fragment>
    )
  }
}

WalletBalances.propTypes = {
  balances: PropTypes.array.isRequired
}

export default WalletBalances
