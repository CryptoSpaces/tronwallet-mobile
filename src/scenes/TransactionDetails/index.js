import React from 'react'
import moment from 'moment'
import { ScrollView, Clipboard, View, Text, RefreshControl } from 'react-native'
import { string, number, bool, shape, array } from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Toast from 'react-native-easy-toast'
import LinearGradient from 'react-native-linear-gradient'
import styled from 'styled-components'

import tl from '../../utils/i18n'
import { updateTransactionByHash, getTranslatedType } from '../../utils/transactionUtils'
import getTransactionStore from '../../store/transactions'
import IconButton from '../../components/IconButton'
import * as Utils from '../../components/Utils'
import * as Elements from './Elements'
import NavigationHeader from '../../components/Navigation/Header'
import { Colors } from '../../components/DesignSystem'
import { ONE_TRX } from '../../services/client'
import { rgb } from '../../../node_modules/polished'
import Copiable from './CopiableAddress'

import { formatFloat } from '../../utils/numberUtils'

class TransactionDetails extends React.Component {
  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <NavigationHeader
          title={tl.t('transactionDetails.title')}
          onBack={() => navigation.goBack()}
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
          tokenPrice: number,
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

  state = {
    refreshing: false,
    item: null
  }

  async componentDidMount () {
    const { item } = this.props.navigation.state.params
    this.setState({ item })
  }

  _copy = async () => {
    const { id } = this.state.item
    try {
      await Clipboard.setString(`https://tronscan.org/#/transaction/${id}`)
      this.refs.hashToast.show(tl.t('transactionDetails.clipboard.tronscanUrl'))
    } catch (error) {
      this.refs.hashToast.show(tl.t('error.clipboardCopied'))
    }
  }

  _renderCard = () => {
    const { id, confirmed, timestamp, block } = this.state.item

    return (
      <React.Fragment>
        <Utils.View style={{
          position: 'absolute',
          right: 16,
          top: 75,
          zIndex: 999
        }}>
          <IconButton icon='md-copy' bg={Colors.summaryText} highlight iconColor='#FFFFFF' onPress={() => this._copy()} />
        </Utils.View>
        <Utils.View
          borderRadius={10}
          marginTop={20}
          borderTopWidth={10}
          borderTopColor={confirmed ? Colors.confirmed : Colors.unconfirmed}
          overflow='hidden'
        >
          <LinearGradient
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            colors={[Colors.transactionCardGradient[0], Colors.transactionCardGradient[1]]}
          >
            <View style={{
              marginHorizontal: 18,
              marginVertical: 20
            }}>
              <Toast
                ref='hashToast'
                position='top'
                fadeInDuration={750}
                fadeOutDuration={1000}
                opacity={0.8}
              />
              <Utils.Row align='center' justify='space-between'>
                <Elements.DetailLabel>{tl.t('transactionDetails.hash')}</Elements.DetailLabel>
              </Utils.Row>
              <View style={{ height: 10 }} />
              <Text style={{
                fontFamily: 'Rubik-Regular',
                fontSize: 14,
                lineHeight: 24,
                marginRight: 40,
                color: 'white'
              }}>{id}</Text>
              <View style={{
                height: 1,
                backgroundColor: 'black',
                marginTop: 16,
                marginBottom: 20
              }} />
              <View>
                <Utils.Column>
                  <Utils.Row align='center' justify='space-between'>
                    <Elements.DetailLabel>{tl.t('transactionDetails.status')}</Elements.DetailLabel>
                    <Utils.VerticalSpacer />
                    <Elements.DetailText>{confirmed ? tl.t('confirmed') : tl.t('unconfirmed')}</Elements.DetailText>
                  </Utils.Row>
                  <Utils.VerticalSpacer size='medium' />
                  <Utils.Row align='center' justify='space-between'>
                    <Elements.DetailLabel>{tl.t('transactionDetails.time')}</Elements.DetailLabel>
                    <Elements.DetailText>{moment(timestamp).format('DD/MM/YYYY hh:mm A')}</Elements.DetailText>
                  </Utils.Row>
                  <Utils.VerticalSpacer size='medium' />
                  <Utils.Row align='center' justify='space-between'>
                    <Elements.DetailLabel>{tl.t('transactionDetails.block')}</Elements.DetailLabel>
                    <Elements.DetailText>{block}</Elements.DetailText>
                  </Utils.Row>
                </Utils.Column>
              </View>
            </View>
          </LinearGradient>
        </Utils.View>
      </React.Fragment>
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
        return '#4a69e2'
    }
  }

  _getIcon = (name, size, color) => (
    <Ionicons
      name={name}
      size={size}
      color={color}
    />
  )

  _getHeaderArrowIcon = (type) => {
    const lowerType = type.toLowerCase()
    const size = 45

    if (lowerType === 'unfreeze') {
      return this._getIcon('ios-unlock', size, '#ffffff')
    }
    if (lowerType === 'freeze') {
      return this._getIcon('ios-lock', size, '#ffffff')
    }
    if (lowerType === 'participate') {
      return this._getIcon('ios-arrow-round-up', size, rgb(63, 231, 123))
    }
    if (lowerType === 'vote' || lowerType === 'transaction') {
      return this._getIcon('ios-arrow-round-down', size, rgb(255, 68, 101))
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
        return tl.t('transactionDetails.frozenBalance')
      case 'unfreeze':
        return tl.t('transactionDetails.unfrozenBalance')
      case 'vote':
        return tl.t('transactionDetails.totalVotes')
      default:
        return tl.t('transactionDetails.amount')
    }
  }

  _getHeaderAmount = () => {
    const { type, contractData: { amount, frozenBalance, votes } } = this.state.item

    switch (type.toLowerCase()) {
      case 'freeze':
        return frozenBalance
      case 'unfreeze':
        return frozenBalance
      case 'vote':
        return Object.keys(votes).reduce((acc, curr) => acc + Number(votes[curr].voteCount), 0)
      default:
        return amount
    }
  }

  _renderHeader = () => {
    const { item: { type, contractData, tokenPrice } } = this.state
    const tokenName = contractData.tokenName
    const tokenToDisplay = this._getHeaderToken(type, tokenName)
    const amountText = this._getHeaderAmountText(type)
    const amountValue = this._getHeaderAmount()

    let amount
    if (type === 'Freeze' || type === 'Unfreeze' || (type === 'Transfer' && tokenName === 'TRX')) {
      amount = amountValue / ONE_TRX
    } else if (type === 'Participate') {
      amount = (amountValue / ONE_TRX) / (tokenPrice / ONE_TRX)
    } else {
      amount = amountValue
    }

    return (
      <View style={{
        alignItems: 'center'
      }}>
        <View style={{
          borderRadius: 5,
          height: 22,
          backgroundColor: this._getHeaderBadgeColor(type),
          justifyContent: 'center',
          paddingHorizontal: 10
        }}>
          <Elements.BadgeText>{getTranslatedType(type).toUpperCase()}</Elements.BadgeText>
        </View>
        <View style={{ height: 15 }} />
        {type.toLowerCase() !== 'create' &&
          <React.Fragment>
            <Text style={{
              fontFamily: 'Rubik-Medium',
              fontSize: 11,
              lineHeight: 11,
              letterSpacing: 0.6,
              color: '#7476a2'
            }}>{amountText}</Text>
            <Utils.Row align='center'>
              <Elements.AmountText>{amount < 1 ? amount : formatFloat(amount)}</Elements.AmountText>
              <View style={{ width: 11, height: 1 }} />
              <View style={{
                backgroundColor: rgb(46, 47, 71),
                borderRadius: 2,
                opacity: 0.97,
                height: 24,
                justifyContent: 'center',
                paddingHorizontal: 8
              }}>
                <Elements.BadgeText>{tokenToDisplay}</Elements.BadgeText>
              </View>
              <Utils.HorizontalSpacer size='medium' />
              {this._getHeaderArrowIcon(type)}
            </Utils.Row>
          </React.Fragment>
        }
      </View>
    )
  }

  _truncateAddress = address => `${address.substring(0, 8)}...${address.substring(address.length - 8, address.length)}`

  _renderToFrom = () => {
    const { type, confirmed, contractData: { transferFromAddress, transferToAddress } } = this.state.item
    const TempText = styled.Text`
      font-family: 'Rubik-Regular';
      font-size: 13;
      line-height: 20;
      color: white;
      flex: 1;
    `
    return (
      <View>
        {type.toLowerCase() === 'transfer' &&
          <React.Fragment>
            <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
              <Text style={{
                fontFamily: 'Rubik-Medium',
                fontSize: 11,
                lineHeight: 11,
                letterSpacing: 0.6,
                color: rgb(116, 118, 162)
              }}>{tl.t('transactionDetails.to')}</Text>
              {this._getIcon('ios-arrow-round-up', 30, confirmed ? rgb(63, 231, 123) : rgb(102, 104, 143))}
            </View>
            <View style={{ flexDirection: 'row', width: '100%' }}>
              <Copiable
                TextComponent={TempText}
                showToast={this._showToast}>
                {transferToAddress}
              </Copiable>
            </View>
            <View style={{ height: 15 }} />
            <Utils.View height={1} background='#51526B' />
            <View style={{ height: 15 }} />
          </React.Fragment>
        }
        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{
            fontFamily: 'Rubik-Medium',
            fontSize: 11,
            lineHeight: 11,
            letterSpacing: 0.6,
            color: rgb(116, 118, 162)
          }}>{tl.t('transactionDetails.from')}</Text>
          {this._getIcon('ios-arrow-round-down', 30, confirmed ? rgb(255, 68, 101) : rgb(102, 104, 143))}
        </View>
        <Copiable
          TextComponent={TempText}
          showToast={this._showToast}>
          {transferFromAddress}
        </Copiable>
      </View>
    )
  }

  _renderCreateBody = () => {
    const {
      tokenName, unityValue, totalSupply, startTime, endTime, description
    } = this.state.item.contractData

    return (
      <Utils.Content>
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>{tl.t('transactionDetails.tokenName')}</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>{tokenName}</Elements.TokenText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>{tl.t('transactionDetails.unityValue')}</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>{(unityValue / ONE_TRX).toFixed(2)} TRX</Elements.TokenText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>{tl.t('transactionDetails.totalSupply')}</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.AmountText>{totalSupply}</Elements.AmountText>
        </Utils.Column>
        <Utils.VerticalSpacer size='big' />
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>{tl.t('transactionDetails.startTime')}</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>{moment(startTime).format('DD/MM/YYYY hh:mm A')}</Elements.DescriptionText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>{tl.t('transactionDetails.endTime')}</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>{moment(endTime).format('DD/MM/YYYY hh:mm A')}</Elements.DescriptionText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>{tl.t('transactionDetails.description')}</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.DescriptionText>
            {description}
          </Elements.DescriptionText>
        </Utils.Column>
      </Utils.Content>
    )
  }

  _copyAddress = async () => {
    await Clipboard.getString()
  }

  _showToast = (text) => {
    this.refs.addressToast.show(text)
  }

  _renderVotes = () => {
    const { votes } = this.state.item.contractData
    const TempText = styled.Text`
      font-family: Rubik-Regular;
      font-size: 11px;
      line-height: 20;
      color: white;
    `

    const votesToRender = votes.map((vote, index) => (
      <React.Fragment
        key={`${vote.voteAddress}-${index}`}
      >
        <Utils.Row justify='space-between' align='center'>
          <Copiable
            TextComponent={TempText}
            showToast={this._showToast}>
            {vote.voteAddress}
          </Copiable>
          <View style={{ height: 14 }}>
            <Text style={{
              fontFamily: 'Rubik-Regular',
              fontSize: 11,
              lineHeight: 20,
              color: 'white'
            }}>{vote.voteCount}</Text>
          </View>
        </Utils.Row>
        <Utils.VerticalSpacer size='medium' />
      </React.Fragment>
    ))

    return (
      <Utils.Column>
        <Utils.VerticalSpacer size='medium' />
        <Utils.Row justify='space-between'>
          <Text style={{
            fontFamily: 'Rubik-Medium',
            fontSize: 11,
            lineHeight: 11,
            letterSpacing: 0.6,
            color: rgb(116, 118, 162)
          }}>{tl.t('transactionDetails.votedAddress')}</Text>
          <Text style={{
            fontFamily: 'Rubik-Medium',
            fontSize: 11,
            lineHeight: 11,
            letterSpacing: 0.6,
            color: rgb(116, 118, 162)
          }}>{tl.t('transactionDetails.amount')}</Text>
        </Utils.Row>
        <Utils.VerticalSpacer size='medium' />
        {votesToRender}
      </Utils.Column>
    )
  }

  _renderDetails = () => {
    const lowerType = this.state.item.type.toLowerCase()
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

  _onRefresh = async () => {
    const { item } = this.state
    this.setState({ refreshing: true })

    await updateTransactionByHash(item.id)
    const transaction = await this._getTransactionByHash(item.id)

    this.setState({ item: transaction, refreshing: false })
  }

  _getTransactionByHash = async (hash) => {
    const store = await getTransactionStore()
    return store
      .objects('Transaction')
      .filtered(`id = '${hash}'`)
      .map(item => Object.assign({}, item))[0]
  }

  render () {
    const { item } = this.state
    return (
      <Utils.Container>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          {item &&
            <React.Fragment>
              {this._renderHeader()}
              <View style={{
                paddingHorizontal: 32
              }}>
                {this._renderCard()}
              </View>
              <View style={{
                paddingHorizontal: 32
              }}>
                <Toast
                  ref='addressToast'
                  position='top'
                  fadeInDuration={750}
                  fadeOutDuration={1000}
                  opacity={0.8}
                />
                <View style={{ height: 24 }} />
                {this._renderDetails()}
              </View>
              <View style={{ paddingVertical: 16 }} />
            </React.Fragment>
          }
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default TransactionDetails
