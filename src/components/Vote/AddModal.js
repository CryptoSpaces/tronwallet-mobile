import React, { Component } from 'react'
import { Modal, ScrollView, SafeAreaView } from 'react-native'
import { withNavigation } from 'react-navigation'

// Design
import * as Utils from '../Utils'
import { Colors, Spacing } from '../DesignSystem'
import ButtonGradient from '../ButtonGradient'
import NavigationHeader from '../Navigation/Header'
import OptionVote from './InOutOption'

// Utils
import formatUrl from '../../utils/formatUrl'
import { formatNumber } from '../../utils/numberUtils'

const voteOptions = {
  1: 1,
  5: 5,
  10: 10,
  25: 25,
  50: 50,
  100: 100,
  500: 500,
  1000: 1000,
  '10k': 10000,
  '100k': 100000,
  '500k': 500000,
  '1m': 1000000
}

class VoteModal extends Component {
  state={
    amountToVote: this.props.currentVoteCount,
    totalRemaining: this.props.totalRemaining,
    totalFrozen: this.props.totalFrozen,
    notEnoughTrx: false
  }

  _renderPadkeys = () => Object.keys(voteOptions).map((voteKey, index) => {
    if (this.state.totalFrozen < 10000 && voteOptions[voteKey] >= 10000) return

    const isDisabled = voteOptions[voteKey] > this.state.totalRemaining

    return <Utils.NumKeyWrapper disabled={isDisabled} key={voteKey} flexBasis={25}>
      <Utils.NumKey
        onPress={() => this._incrementVoteCount(voteOptions[voteKey])}>
        <Utils.Text light primary>+{voteKey}</Utils.Text>
      </Utils.NumKey>
    </Utils.NumKeyWrapper>
  })

  _incrementVoteCount = quant => {
    const { totalRemaining, amountToVote } = this.state
    if (totalRemaining - quant < 0) {
      this.setState({notEnoughTrx: true})
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
      modalVisible,
      currentVoteItem,
      closeModal,
      acceptCurrentVote,
      navigation
    } = this.props

    const {
      amountToVote,
      totalRemaining,
      notEnoughTrx
    } = this.state

    const { url: candidateUrl } = currentVoteItem
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
        style={{ backgroundColor: Colors.background }}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
          <Utils.Container>
            <ScrollView>
              <NavigationHeader
                onBack={closeModal}
                title={formatUrl(candidateUrl)}
                noBorder
              />
              <Utils.View paddingX={'medium'}>
                <Utils.VerticalSpacer size='medium' />
                <Utils.Text margin={Spacing.small} size='smaller' align='right'>
              ENTER THE VOTE VALUE
                </Utils.Text>
                <Utils.Text margin={Spacing.small} size='large' align='right'>
                  {formatNumber(amountToVote)}
                </Utils.Text>
                <Utils.Row marginRight={Spacing.small} justify='flex-end' align='flex-end'>
                  <Utils.Text lineHeight={14} margin={Spacing.xsmall} align='right' size='smaller' secondary>
                  VOTES REMAINING
                  </Utils.Text>
                  <Utils.Text
                    margin={Spacing.xsmall}
                    align='right'
                    size='smaller'
                    style={{
                      fontFamily: 'Helvetica'
                    }}>
                    {formatNumber(totalRemaining)}
                  </Utils.Text>
                </Utils.Row>
                <Utils.NumPadWrapper>
                  {this._renderPadkeys()}
                </Utils.NumPadWrapper>
                <Utils.NumPadWrapper>
                  <OptionVote
                    title='Clear'
                    disabled={amountToVote === 0}
                    onPress={this._clearVoteCount}
                  />
                  <OptionVote
                    title='All in'
                    disabled={totalRemaining <= 0}
                    onPress={this._allinVoteCount}
                  />
                </Utils.NumPadWrapper>
                <Utils.VerticalSpacer size='small' />
                <Utils.NumPadWrapper>
                  <Utils.NumKeyWrapper flexBasis={100}>
                    <Utils.VoteOption background={Colors.lightPurple} onPress={() => acceptCurrentVote(amountToVote)}>
                      <Utils.Text size='xsmall' color={Colors.primaryText} font={'bold'}>
                      ADD VOTE
                      </Utils.Text>
                    </Utils.VoteOption>
                  </Utils.NumKeyWrapper>
                </Utils.NumPadWrapper>
                {notEnoughTrx && (
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
                )}
              </Utils.View>
            </ScrollView>
          </Utils.Container>
        </SafeAreaView>
      </Modal>
    )
  }
}
export default withNavigation(VoteModal)
