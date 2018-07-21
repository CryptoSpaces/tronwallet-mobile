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
import { formatNumber } from '../../../utils/numberUtils'

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
    amountToVote: 10,
    totalRemaining: 10,
    notEnoughTrx: false
  }

  _incrementVoteCount = quant => {
    const { totalRemaining, amountToVote } = this.state
    if (totalRemaining - quant < 0) {
      this.setState({ notEnoughTrx: true })
      return
    }
    this.setState({
      amountToVote: amountToVote + quant,
      totalRemaining: totalRemaining - quant,
      notEnoughTrx: false
    })
  }

  _allinVoteCount = () => {
    const { totalRemaining, amountToVote } = this.state
    this.setState({
      amountToVote: totalRemaining + amountToVote,
      totalRemaining: 0,
      notEnoughTrx: false
    })
  }

  _clearVoteCount = () => {
    this.setState({
      amountToVote: 0,
      totalRemaining: this.state.totalRemaining + this.state.amountToVote,
      notEnoughTrx: false
    })
  }

  render () {
    const {
      amountToVote,
      totalRemaining
    } = this.state

    // const { url: candidateUrl, votes: totalVotes } = currentVoteItem
    return (

      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView>
          <BuyContainer>
            <WhiteBuyText>ENTER AMOUNT TO BUY</WhiteBuyText>
            <VerticalSpacer size={4} />
            <AmountText>
              {formatNumber(amountToVote)}
            </AmountText>
            <BuyText>BALANCE: 100,100,100 TRX</BuyText>
            <VerticalSpacer size={7} />
            <BuyText>PRICE PER TOKEN: 0.1 TRX</BuyText>
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
                disabled={amountToVote === 0}
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
            <BuyText>Lorem lorem lorem lorem lorem</BuyText>
            <VerticalSpacer size={17} />
            <MoreInfoButton>
              <TouchableOpacity onPress={() => { }}>
                <ButtonText>MORE INFO</ButtonText>
              </TouchableOpacity>
            </MoreInfoButton>
          </BuyContainer>
          {/* {notEnoughTrx && (
                <Utils.View paddingY='medium' align='center'>
                  <Utils.Text secondary light size='small'>
                    If you need more votes you can Freeze more TRX.
                    </Utils.Text>
                  <Utils.VerticalSpacer size='medium' />
                  <ButtonGradient
                    onPress={() => {
                      closeModal()
                      navigation.navigate('Freeze')
                    }}
                    text='FREEZE'
                    size='medium'
                    width={100}
                  />
                </Utils.View>
              )} */}
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default withNavigation(BuyScene)
