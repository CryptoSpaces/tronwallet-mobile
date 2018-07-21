import React, { Component } from 'react'
import { ScrollView, SafeAreaView, TouchableOpacity } from 'react-native'
import { withNavigation } from 'react-navigation'

// Design
import * as Utils from '../../../components/Utils'
import { Colors } from '../../../components/DesignSystem'
import ButtonGradient from '../../../components/ButtonGradient'
import NavigationHeader from '../../../components/Navigation/Header'

import {
  BuyText,
  WhiteBuyText,
  BuyContainer,
  VerticalSpacer,
  AmountText,
  MarginFixer,
  MoreInfoButton,
  ButtonText
} from '../Elements'

// Utils
import getBalanceStore from '../../../store/balance'
import { formatNumber } from '../../../utils/numberUtils'
import { ONE_TRX } from '../../../services/client'

const padKeys = [1, 5, 10, 25, 50, 100, 500, 1000]

const OptionVote = ({ title, disabled, background, onPress, width }) => (
  <Utils.NumKeyWrapper width={width}>
    <Utils.VoteOption disabled={disabled} background={background} onPress={onPress}>
      <Utils.Text primary>{title}</Utils.Text>
    </Utils.VoteOption>
  </Utils.NumKeyWrapper>
)

class BuyScene extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title={navigation.state.params.item.name}
          onBack={() => navigation.goBack()}
        />
      )
    }
  }

  state = {
    totalRemaining: 0,
    amountToBuy: 0,
    trxBalance: 0,
    notEnoughTrx: false
  }

  async componentDidMount () {
    const balances = await this._getBalancesFromStore()
    if (balances.length) {
      this.setState({ trxBalance: balances[0].balance, totalRemaining: balances[0].balance })
    }
  }

  _getBalancesFromStore = async () => {
    const store = await getBalanceStore()
    return store
      .objects('Balance')
      .filtered(
        `name = 'TRX'`
      )
      .map(item => Object.assign({}, item))
  }

  _incrementVoteCount = quant => {
    const { price } = this.props.navigation.state.params.item
    const { amountToBuy, totalRemaining } = this.state

    const amountToPay = (price / ONE_TRX) * quant

    if (amountToPay > totalRemaining) {
      this.setState({ notEnoughTrx: true })
      return
    }
    this.setState({
      amountToBuy: amountToBuy + quant,
      totalRemaining: totalRemaining - amountToPay,
      notEnoughTrx: false
    })
  }

  _allinVoteCount = () => {
    const { price } = this.props.navigation.state.params.item
    const { trxBalance } = this.state

    const amountToBuy = Math.floor(trxBalance / (price / ONE_TRX))

    if (amountToBuy > 0) {
      const amountToPay = amountToBuy * (price / ONE_TRX)
      this.setState({
        amountToBuy: amountToBuy,
        totalRemaining: trxBalance - amountToPay,
        notEnoughTrx: false
      })
    } else {
      this.setState({ notEnoughTrx: true })
    }
  }

  _clearVoteCount = () => {
    this.setState({
      amountToBuy: 0,
      totalRemaining: this.state.trxBalance,
      notEnoughTrx: false
    })
  }

  render () {
    const { name, price, description } = this.props.navigation.state.params.item
    const { totalRemaining, amountToBuy, notEnoughTrx } = this.state

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView>
          <BuyContainer>
            <WhiteBuyText>ENTER AMOUNT TO BUY</WhiteBuyText>
            <VerticalSpacer size={4} />
            <AmountText>
              {formatNumber(amountToBuy)}
            </AmountText>
            <BuyText>BALANCE: {formatNumber(totalRemaining)} TRX</BuyText>
            <VerticalSpacer size={7} />
            <BuyText>PRICE PER TOKEN: {price / ONE_TRX} TRX</BuyText>
            <VerticalSpacer size={13} />
          </BuyContainer>
          <MarginFixer>
            <Utils.Row wrap='wrap'>
              {padKeys.map((voteKey) => {
                return (
                  <Utils.NumKeyWrapper key={voteKey} flexBasis={25}>
                    <Utils.NumKey onPress={() => this._incrementVoteCount(voteKey)}>
                      <Utils.Text primary>+{voteKey}</Utils.Text>
                    </Utils.NumKey>
                  </Utils.NumKeyWrapper>
                )
              })}
            </Utils.Row>
          </MarginFixer>
          <VerticalSpacer size={14} />
          <MarginFixer>
            <Utils.Row>
              <OptionVote
                title='Clear'
                disabled={amountToBuy === 0}
                onPress={this._clearVoteCount}
                background={Colors.backgroundColor}
              />
              <OptionVote
                title='All in'
                disabled={totalRemaining <= 0}
                onPress={this._allinVoteCount}
                background={Colors.background}
              />
            </Utils.Row>
          </MarginFixer>
          <VerticalSpacer size={1} />
          <BuyContainer>
            <ButtonGradient
              onPress={() => { }}
              text='CONFIRM'
            />
            <VerticalSpacer size={23} />
            <BuyText>TOKEN DESCRIPTION</BuyText>
            <VerticalSpacer size={17} />
            <BuyText>{description}</BuyText>
            <VerticalSpacer size={17} />
            <MoreInfoButton>
              <TouchableOpacity onPress={() => { this.props.navigation.navigate('TokenInfo') }}>
                <ButtonText>MORE INFO</ButtonText>
              </TouchableOpacity>
            </MoreInfoButton>
          </BuyContainer>
          {notEnoughTrx && (
            <Utils.View paddingY='medium' align='center'>
              <Utils.Text secondary light size='small'>
                You don't have enough TRX to buy that many {name}.
              </Utils.Text>
            </Utils.View>
          )}
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default withNavigation(BuyScene)
