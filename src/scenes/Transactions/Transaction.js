import React from 'react'
import moment from 'moment'
import { configureTransaction } from './Utils'

import * as Elements from './elements'

const Transaction = ({ item, onPress, publicKey }) => {
  /* Renders the top row with the badge and the amount information pertaining
  to the specific transaction. */
  const _renderTopInfoRow = ({amount, icon, badgeColor}) => (
    <Elements.InfoRow>
      <Elements.Badge color={badgeColor}>
        <Elements.BadgeText>
          {item.type.toUpperCase()}
        </Elements.BadgeText>
      </Elements.Badge>
      <Elements.TransactionValue>
        {!!amount && (
          <React.Fragment>
            <Elements.InfoAmount>{amount}</Elements.InfoAmount>
            <Elements.HSpacer />
          </React.Fragment>
        )}
        <icon.Type name={icon.name} color='white' size={icon.size} />
      </Elements.TransactionValue>
    </Elements.InfoRow>
  )

  /* Renders the row with the confirmation and time ago information */
  const _renderMiddleInfoRow = () => (
    <Elements.InfoRow>
      <Elements.Confirmation>
        {item.confirmed ? 'Confirmed' : 'Unconfirmed'}
      </Elements.Confirmation>
      <Elements.Moment>
        {moment(item.timestamp).fromNow()}
      </Elements.Moment>
    </Elements.InfoRow>
  )

  /* Renders the bottom component where the address is displayed. */
  const _renderAddress = ({from, to}) => (
    <React.Fragment>
      <Elements.AddressRow>
        <Elements.AddressTitle>From: </Elements.AddressTitle>
        <Elements.Address>{from}</Elements.Address>
      </Elements.AddressRow>
      {to && (
        <Elements.AddressRow>
          <Elements.AddressTitle>To: </Elements.AddressTitle>
          <Elements.Address>{to}</Elements.Address>
        </Elements.AddressRow>
      )}
    </React.Fragment>
  )

  /* Configures the object used to hidrate the render components with the proper
  texts and icons. */
  const config = configureTransaction(item, {
    topRow: _renderTopInfoRow,
    addressRow: _renderAddress,
    publicKey
  })

  return (
    <Elements.Card onPress={onPress} confirmed={item.confirmed}>
      {config.topRow()}
      <Elements.VSpacer />
      {_renderMiddleInfoRow()}
      {config.addressRow && (
        <React.Fragment>
          <Elements.VSpacer />
          {config.addressRow()}
        </React.Fragment>
      )}
    </Elements.Card>
  )
}

export default Transaction
