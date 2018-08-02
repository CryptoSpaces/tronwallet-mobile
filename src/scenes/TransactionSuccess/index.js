import React, { PureComponent } from 'react'

import { SuccessSpecialMessage } from '../../components/SpecialMessage'
import { Icon, SuccessText, Wrapper } from './elements'

class TransactionsSuccess extends PureComponent {
  _renderMiddleContent = () => (
    <Wrapper>
      <Icon source={require('../../assets/checked.png')} />
      <SuccessText>TRANSACTION SUBMITTED TO NETWORK!</SuccessText>
    </Wrapper>
  )

  _renderBottomContent = () => null

  render () {
    return (
      <SuccessSpecialMessage message='GOOD NEWS!'
        renderMiddleContent={this._renderMiddleContent}
        renderBottomContent={this._renderBottomContent}
        bgIllustration={require('../../assets/circle-illustration-green.png')}
        bgCenter={require('../../assets/bg-success.png')}
      />
    )
  }
}

export default TransactionsSuccess
