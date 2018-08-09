import React, { PureComponent } from 'react'
import { NavigationActions, StackActions } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'

import tl from '../../utils/i18n'
import { SuccessSpecialMessage } from '../../components/SpecialMessage'
import { Icon, SuccessText, Wrapper, ContinueButton } from './elements'

class TransactionsSuccess extends PureComponent {
  _navigateNext = () => {
    // Reset navigation as transaction submition is the last step of a user interaction
    const { navigation } = this.props
    const stackToReset = navigation.getParam('stackToReset', null)
    const resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({ routeName: 'App' }),
        NavigationActions.navigate({ routeName: stackToReset })
      ]
    })
    const navigateToHome = NavigationActions.navigate({ routeName: 'Transactions' })
    if (stackToReset) {
      navigation.dispatch(resetAction)
    }
    navigation.dispatch(navigateToHome)
  }

  _renderMiddleContent = () => (
    <Wrapper>
      <Icon source={require('../../assets/checked.png')} />
      <SuccessText>{tl.t('transactionSuccess.submitted')}</SuccessText>
    </Wrapper>
  )

  _renderBottomContent = () => (
    <ContinueButton onPress={this._navigateNext}>
      <Ionicons
        name='ios-arrow-round-forward'
        size={54}
        color='white'
      />
    </ContinueButton>
  )

  render () {
    return (
      <SuccessSpecialMessage message={tl.t('transactionSuccess.success')}
        renderMiddleContent={this._renderMiddleContent}
        renderBottomContent={this._renderBottomContent}
        bgIllustration={require('../../assets/circle-illustration-green.png')}
        bgCenter={require('../../assets/bg-success.png')}
      />
    )
  }
}

export default TransactionsSuccess
