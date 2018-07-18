import React, {Component} from 'react'
import { Modal, ScrollView } from 'react-native'
import { withNavigation } from 'react-navigation'
// Design
import * as Utils from '../Utils'
import { Colors, Spacing } from '../DesignSystem'
import ButtonGradient from '../ButtonGradient'
import NavigationHeader from '../Navigation/Header'

// Utils
import formatUrl from '../../utils/formatUrl'
import { formatNumber } from '../../utils/numberUtils'

const padKeys = [1, 5, 10, 25, 50, 100, 500, 1000]

const OptionVote = ({title, disabled, background, onPress}) => (
  <Utils.NumKeyWrapper flexBasis={50}>
    <Utils.VoteOption disabled={disabled} background={background} onPress={onPress}>
      <Utils.Text primary>{title}</Utils.Text>
    </Utils.VoteOption>
  </Utils.NumKeyWrapper>
)

class VoteModal extends Component {
  state={
    amountToVote: this.props.currentVoteCount,
    totalRemaining: this.props.totalRemaining,
    notEnoughTrx: false
  }

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

    const { url: candidateUrl, votes: totalVotes } = currentVoteItem
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={modalVisible}
        onRequestClose={closeModal}
        style={{ backgroundColor: 'red' }}
      >
        <Utils.Container>
          <ScrollView>
            <NavigationHeader
              onBack={closeModal}
              title={formatUrl(candidateUrl)}
              noBorder
            />
            <Utils.View paddingX={'medium'}>
              <Utils.Row justify='center' align='center'>
                <Utils.Text weight={400} padding={Spacing.xsmall} size='smaller' secondary>
                TOTAL VOTES
                </Utils.Text>
                <Utils.Text weight={400} padding={Spacing.xsmall} size='smaller'>
                  {totalVotes}
                </Utils.Text>
              </Utils.Row>
              <Utils.VerticalSpacer size='large' />
              <Utils.Text margin={Spacing.small} weight={400} size='average' align='right'>
            ENTER THE VOTE VALUE
              </Utils.Text>
              <Utils.VerticalSpacer />
              <Utils.Text margin={Spacing.small} size='large' align='right'>
                {formatNumber(amountToVote)}
              </Utils.Text>
              <Utils.VerticalSpacer size='large' />
              <Utils.NumPadWrapper>
                {padKeys.map((voteKey, index) => {
                  return (
                    <Utils.NumKeyWrapper key={voteKey} flexBasis={25}>
                      <Utils.NumKey onPress={() => this._incrementVoteCount(voteKey)}>
                        <Utils.Text primary>+{voteKey}</Utils.Text>
                      </Utils.NumKey>
                    </Utils.NumKeyWrapper>
                  )
                })}
              </Utils.NumPadWrapper>
              <Utils.NumPadWrapper>
                <OptionVote
                  title='Clear'
                  disabled={amountToVote === 0}
                  onPress={this._clearVoteCount}
                  background={Colors.background}
                />
                <OptionVote
                  title='All in'
                  disabled={totalRemaining <= 0}
                  onPress={this._allinVoteCount}
                  background={Colors.backgroundColor}
                />
              </Utils.NumPadWrapper>
              <Utils.VerticalSpacer size='small' />
              <Utils.Row justify='center' align='center'>
                <Utils.Text weight={400} padding={Spacing.xsmall} size='smaller' secondary>
                TOTAL REMAINING
                </Utils.Text>
                <Utils.Text weight={400} padding={Spacing.xsmall} size='smaller'>
                  {totalRemaining}
                </Utils.Text>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
              <Utils.NumPadWrapper>
                <OptionVote
                  title='ADD VOTE'
                  background={Colors.lightPurple}
                  onPress={() => acceptCurrentVote(amountToVote)}
                />
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
      </Modal>
    )
  }
}
export default withNavigation(VoteModal)
