import React from 'react'
import moment from 'moment'
import { ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { string, number, bool, shape, array } from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Toast from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient'

import IconButton from '../../components/IconButton'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'
import * as Elements from './Elements'
import NavigationHeader from '../../components/Navigation/Header'
import { Colors } from '../../components/DesignSystem'
import { ONE_TRX } from '../../services/client'

class TransactionDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title='TRANSACTION'
          onBack={() => navigation.goBack()}
          rightButton={
            <TouchableOpacity onPress={() => { }}>
              <Feather name='share-2' color='white' size={21} />
            </TouchableOpacity>
          }
        />
      )
    }
  }

  static propTypes = {
    navigation: shape({
      state: shape({
        params: shape({
          id: string,
          type: string,
          timestamp: number,
          ownerAddress: string,
          confirmed: bool,
          block: string,
          contractData: shape({
            tokenName: string,
            transferFromAddress: string,
            transferToAddress: string,
            amount: number,
            frozenBalance: number,
            description: string,
            startTime: number,
            endTime: number,
            totalSupply: number,
            unityValue: number,
            votes: array
          })
        })
      })
    })
  }

  _copy = async () => {
    const { id } = this.props.navigation.state.params.item
    try {
      await Clipboard.setString(id)
      this.refs.toast.show('Hash Key copied to the clipboard')
    } catch (error) {
      this.refs.toast.show('Something wrong while copying')
    }
  }

  _renderCard = () => {
    const { id, confirmed, timestamp, block } = this.props.navigation.state.params.item

    return (
      <Utils.View
        borderRadius={10}
        marginRight={25}
        marginLeft={25}
        borderTopWidth={10}
        borderTopColor={confirmed ? Colors.green : Colors.orange}
      >
        <LinearGradient
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          colors={[Colors.secondaryText, Colors.lighterBackground]}
        >
          <Utils.Content>
            <Utils.Row align='center' justify='space-between'>
              <Elements.CardLabel>HASH</Elements.CardLabel>
              <Utils.View>
                <IconButton icon='md-clipboard' bg={Colors.summaryText} iconColor='#FFFFFF' onPress={() => this._copy()} />
              </Utils.View>
            </Utils.Row>
            <Utils.View flex={1}>
              <Elements.CardText>{id}</Elements.CardText>
            </Utils.View>
          </Utils.Content>
          <Utils.View height={1} marginLeftPercent={5} width='90%' background='black' />
          <Utils.Content>
            <Utils.Row>
              <Utils.View>
                <Elements.CardLabel>STATUS</Elements.CardLabel>
                <Utils.VerticalSpacer />
                <Elements.CardText>{confirmed ? 'Confirmed' : 'Unconfirmed'}</Elements.CardText>
              </Utils.View>
              <Utils.View flex={1} />
              <Utils.View>
                <Elements.CardLabel>BLOCK</Elements.CardLabel>
                <Utils.VerticalSpacer />
                <Elements.CardText>{block}</Elements.CardText>
              </Utils.View>
              <Utils.View flex={1} />
              <Utils.View>
                <Elements.CardLabel>TIME</Elements.CardLabel>
                <Utils.VerticalSpacer />
                <Elements.CardText>{moment(timestamp).format('DD/MM/YYYY hh:mm A')}</Elements.CardText>
              </Utils.View>
            </Utils.Row>
          </Utils.Content>
        </LinearGradient>
      </Utils.View>
    )
  }

  _getHeaderBadgeColor = (type) => {
    switch (type.toLowerCase()) {
      case 'create':
        return '#94C047'
      case 'unfreeze':
        return 'teal'
      case 'freeze':
        return '#25B9E3'
      case 'participate':
        return '#6442E4'
      case 'vote':
        return '#BB2DC4'
      default:
        return '#1f90e6'
    }
  }

  _getHeaderArrowIcon = (type) => {
    const lowerType = type.toLowerCase()

    if (lowerType === 'unfreeze') {
      return (
        <Ionicons
          name='ios-unlock'
          size={45}
          color='#ffffff'
        />
      )
    }
    if (lowerType === 'freeze') {
      return (
        <Ionicons
          name='ios-lock'
          size={45}
          color='#ffffff'
        />
      )
    }
    if (lowerType === 'participate') {
      return (
        <Ionicons
          name='ios-arrow-round-up'
          size={45}
          color='green'
        />
      )
    }
    if (lowerType === 'vote' || lowerType === 'transaction') {
      return (
        <Ionicons
          name='ios-arrow-round-down'
          size={45}
          color='red'
        />
      )
    }
    return null
  }

  _getHeaderToken = (type, tokenName) => {
    if (type.toLowerCase() === 'vote') return 'TP'
    if (tokenName) return tokenName
    return 'TRX'
  }

  _getHeaderAmountText = (type) => {
    switch (type.toLowerCase()) {
      case 'freeze':
        return 'FROZEN BALANCE'
      case 'unfreeze':
        return 'UNFROZEN BALANCE'
      case 'vote':
        return 'TOTAL VOTES'
      default:
        return 'AMOUNT'
    }
  }

  _getHeaderAmount = () => {
    const { type, contractData: { amount, frozenBalance, votes } } = this.props.navigation.state.params.item

    switch (type.toLowerCase()) {
      case 'freeze':
        return frozenBalance
      case 'unfreeze':
        return frozenBalance
      case 'vote':
        return votes.length
      default:
        return amount
    }
  }

  _renderHeader = () => {
    const { type, contractData: { tokenName } } = this.props.navigation.state.params.item

    const tokenToDisplay = this._getHeaderToken(type, tokenName)
    const amountText = this._getHeaderAmountText(type)
    const amountValue = this._getHeaderAmount()
    const convertedAmount = tokenToDisplay === 'TRX' ? amountValue / ONE_TRX : amountValue

    return (
      <Utils.Content align='center'>
        <Badge bg={this._getHeaderBadgeColor(type)}>
          <Elements.BadgeText>{type.toUpperCase()}</Elements.BadgeText>
        </Badge>
        <Utils.VerticalSpacer size='medium' />
        {type.toLowerCase() !== 'create' &&
          <React.Fragment>
            <Elements.CardLabel>{amountText}</Elements.CardLabel>
            <Utils.VerticalSpacer />
            <Utils.Row align='center'>
              <Elements.AmountText>{convertedAmount.toFixed(2)}</Elements.AmountText>
              <Utils.HorizontalSpacer size='medium' />
              <Badge bg={Colors.lightestBackground}>
                <Elements.BadgeText>{tokenToDisplay}</Elements.BadgeText>
              </Badge>
              <Utils.HorizontalSpacer size='medium' />
              {this._getHeaderArrowIcon(type)}
            </Utils.Row>
          </React.Fragment>
        }
      </Utils.Content>
    )
  }

  _renderToFrom = () => {
    const { type, contractData: { transferFromAddress, transferToAddress } } = this.props.navigation.state.params.item

    return (
      <Utils.Content>
        {type.toLowerCase() === 'transfer' &&
          <React.Fragment>
            <Utils.Row justify='space-between' align='center'>
              <Elements.Label flex={1}>TO</Elements.Label>
              <Ionicons
                name='ios-arrow-round-up'
                size={45}
                color='green'
              />
            </Utils.Row>
            <Elements.CardText>{transferToAddress}</Elements.CardText>
            <Utils.VerticalSpacer size='medium' />
            <Utils.View height={1} background='#51526B' />
          </React.Fragment>
        }
        <Utils.Row justify='space-between' align='center'>
          <Elements.Label flex={1}>FROM</Elements.Label>
          <Ionicons
            name='ios-arrow-round-down'
            size={45}
            color='red'
          />
        </Utils.Row>
        <Elements.CardText>{transferFromAddress}</Elements.CardText>
      </Utils.Content>
    )
  }

  _renderCreateBody = () => {
    const {
      tokenName, unityValue, totalSupply, startTime, endTime, description
    } = this.props.navigation.state.params.item.contractData

    return (
      <Utils.Content>
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>TOKEN NAME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>{tokenName}</Elements.TokenText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>UNITY VALUE</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>{(unityValue / ONE_TRX).toFixed(2)} TRX</Elements.TokenText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>TOTAL SUPPLY</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.AmountText>{totalSupply}</Elements.AmountText>
        </Utils.Column>
        <Utils.VerticalSpacer size='big' />
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>START TIME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>{moment(startTime).format('DD/MM/YYYY hh:mm A')}</Elements.DescriptionText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>END TIME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>{moment(endTime).format('DD/MM/YYYY hh:mm A')}</Elements.DescriptionText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>DESCRIPTION</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.DescriptionText>
            {description}
          </Elements.DescriptionText>
        </Utils.Column>
      </Utils.Content>
    )
  }

  _renderVotes = () => {
    const { votes } = this.props.navigation.state.params.item.contractData

    const votesToRender = votes.map((vote, index) => (
      <React.Fragment
        key={`${vote.voteAddress}-${index}`}
      >
        <Utils.Row justify='space-between'>
          <Elements.DescriptionText>{vote.voteAddress}</Elements.DescriptionText>
          <Elements.CardText>{vote.voteCount}</Elements.CardText>
        </Utils.Row>
        <Utils.VerticalSpacer size='medium' />
      </React.Fragment>
    ))

    return (
      <Utils.Content>
        <Utils.Column>
          <Utils.Row justify='space-between'>
            <Elements.Label>VOTED ADDRESS</Elements.Label>
            <Elements.Label>AMOUNT</Elements.Label>
          </Utils.Row>
          <Utils.VerticalSpacer size='medium' />
          {votesToRender}
        </Utils.Column>
      </Utils.Content>
    )
  }

  _renderDetails = () => {
    const lowerType = this.props.navigation.state.params.item.type.toLowerCase()
    switch (lowerType) {
      case 'transfer':
        return this._renderToFrom()
      case 'vote':
        return this._renderVotes()
      case 'create':
        return this._renderCreateBody()
      case 'participate':
        return this._renderToFrom()
      default:
        return null
    }
  }

  render () {
    return (
      <Utils.Container>
        <ScrollView>
          {this._renderHeader()}
          {this._renderCard()}
          {this._renderDetails()}
          <Toast
            ref='toast'
            position='center'
            fadeInDuration={750}
            fadeOutDuration={1000}
            opacity={0.8}
          />
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default TransactionDetails
