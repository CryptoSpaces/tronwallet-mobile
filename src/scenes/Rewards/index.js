import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackActions, NavigationActions } from 'react-navigation'

import tl from '../../utils/i18n'
import * as Elements from './elements'
import { Colors, FontSize } from '../../components/DesignSystem'
import SpecialMessage from '../../components/SpecialMessage'

class RewardsScreen extends PureComponent {
  _navigateHome = () => {
    const { navigation } = this.props
    const resetAction = StackActions.reset({
      index: 0,
      actions: [NavigationActions.navigate({ routeName: 'App' })],
      key: null
    })
    navigation.dispatch(resetAction)
  }

  _centerContent = () => {
    const { label, amount, token } = this.props.navigation.state.params
    return (
      <Elements.Wrapper>
        <Elements.AccountText>
          {label}
        </Elements.AccountText>
        <Elements.EarnedText>
          {tl.t('rewards.earned')}
        </Elements.EarnedText>
        <Elements.AmountText>
          {amount}
        </Elements.AmountText>
        <Elements.TokenBadge
          elevation={5}
          style={{shadowOffset: { width: 4, height: 4 }}}>
          <Elements.TokenText>
            {token}
          </Elements.TokenText>
        </Elements.TokenBadge>
      </Elements.Wrapper>
    )
  }

  _bottomContent = () => (
    <Elements.ContinueButton onPress={this._navigateHome}>
      <Ionicons
        name='ios-arrow-round-forward'
        size={FontSize.huge}
        color={Colors.primaryText}
      />
    </Elements.ContinueButton>
  )

  render () {
    return (
      <SpecialMessage
        message={tl.t('rewards.title')}
        renderMiddleContent={this._centerContent}
        renderBottomContent={this._bottomContent}
      />
    )
  }
}

RewardsScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        label: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
          .isRequired,
        token: PropTypes.string.isRequired
      })
    })
  })
}

export default RewardsScreen
