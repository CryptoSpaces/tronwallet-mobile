import React from 'react'
import moment from 'moment'
import { ScrollView, TouchableOpacity, Clipboard } from 'react-native'
import { string, number, bool, shape } from 'prop-types'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'
import Toast from 'react-native-easy-toast'

import IconButton from '../../components/IconButton'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'
import * as Elements from './Elements'
import NavigationHeader from '../../components/Navigation/Header'
import { Colors } from '../../components/DesignSystem'

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
            frozenBalance: number
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
        background={Colors.secondaryText}
        borderRadius={10}
        marginRight={25}
        marginLeft={25}
        borderTopWidth={10}
        borderTopColor={confirmed ? Colors.green : Colors.orange}
      >
        <Utils.Content>
          <Elements.CardLabel>HASH</Elements.CardLabel>
          <Utils.VerticalSpacer />
          <Utils.Row align='center'>
            <Utils.View flex={1}>
              <Elements.CardText>{id}</Elements.CardText>
            </Utils.View>
            <Utils.HorizontalSpacer size='big' />
            <Utils.View>
              <IconButton icon='md-clipboard' bg='#66688F' iconColor='#FFFFFF' onPress={() => this._copy()} />
            </Utils.View>
          </Utils.Row>
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
      </Utils.View>
    )
  }

  _getHeaderBadgeColor = (type) => {
    switch (type) {
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
    if (type === 'freeze' || type === 'participate') {
      return (
        <Ionicons
          name='ios-arrow-round-up'
          size={45}
          color='green'
        />
      )
    }
    if (type === 'vote' || type === 'transaction') {
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

  _renderHeader = () => {
    const { type, contractData: { amount, frozenBalance, tokenName } } = this.props.navigation.state.params.item
    const amountText = type === 'freeze' || type === 'unfreeze' ? 'FROZEN BALANCE' : 'AMOUNT'
    const amountValue = amountText === 'FROZEN BALANCE' ? frozenBalance : amount

    return (
      <Utils.Content align='center'>
        <Badge bg={this._getHeaderBadgeColor(type)}>
          <Elements.BadgeText>{type.toUpperCase()}</Elements.BadgeText>
        </Badge>
        <Utils.VerticalSpacer size='medium' />
        {type !== 'create' &&
          <React.Fragment>
            <Elements.CardLabel>{amountText}</Elements.CardLabel>
            <Utils.VerticalSpacer />
            <Utils.Row align='center'>
              <Elements.AmountText>{amountValue}</Elements.AmountText>
              <Utils.HorizontalSpacer size='medium' />
              <Badge bg={Colors.secondaryText}>
                <Elements.BadgeText>{tokenName}</Elements.BadgeText>
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
    return (
      <Utils.Content>
        <Utils.Row justify='space-between' align='center'>
          <Elements.Label flex={1}>TO</Elements.Label>
          <Ionicons
            name='ios-arrow-round-up'
            size={45}
            color='green'
          />
        </Utils.Row>
        <Elements.CardText>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.CardText>
        <Utils.VerticalSpacer size='medium' />
        <Utils.View height={1} background='#51526B' />
        <Utils.Row justify='space-between' align='center'>
          <Elements.Label flex={1}>FROM</Elements.Label>
          <Ionicons
            name='ios-arrow-round-down'
            size={45}
            color='red'
          />
        </Utils.Row>
        <Elements.CardText>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.CardText>
      </Utils.Content>
    )
  }

  _renderCreateBody = () => {
    return (
      <Utils.Content>
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>TOKEN NAME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>HTX</Elements.TokenText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>UNITY VALUE</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.TokenText>0.02 TRX</Elements.TokenText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>TOTAL SUPPLY</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.AmountText>3,000,000</Elements.AmountText>
        </Utils.Column>
        <Utils.VerticalSpacer size='big' />
        <Utils.Row>
          <Utils.Column>
            <Elements.Label>START TIME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>07/06/2018 2:00PM</Elements.DescriptionText>
          </Utils.Column>
          <Utils.Column position='absolute' left='50%'>
            <Elements.Label>END TIME</Elements.Label>
            <Utils.VerticalSpacer size='xsmall' />
            <Elements.DescriptionText>07/06/2018 2:00PM</Elements.DescriptionText>
          </Utils.Column>
        </Utils.Row>
        <Utils.VerticalSpacer size='big' />
        <Utils.Column>
          <Elements.Label>DESCRIPTION</Elements.Label>
          <Utils.VerticalSpacer size='xsmall' />
          <Elements.DescriptionText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam consequat scelerisque arcu,
            vel lobortis sapien vestibulum et. Mauris sagittis lobortis tempus. Ut fermentum sem erat,
            at ultrices tellus pharetra in.
          </Elements.DescriptionText>
        </Utils.Column>
      </Utils.Content>
    )
  }

  _renderVotes = () => {
    return (
      <Utils.Content>
        <Utils.Column>
          <Utils.Row justify='space-between'>
            <Elements.Label>VOTED ADDRESS</Elements.Label>
            <Elements.Label>AMOUNT</Elements.Label>
          </Utils.Row>
          <Utils.VerticalSpacer size='medium' />
          <Utils.Row justify='space-between'>
            <Elements.DescriptionText>TronGr17.com</Elements.DescriptionText>
            <Elements.CardText>0</Elements.CardText>
          </Utils.Row>
          <Utils.VerticalSpacer size='medium' />
          <Utils.Row justify='space-between'>
            <Elements.DescriptionText>TronGr17.com</Elements.DescriptionText>
            <Elements.CardText>0</Elements.CardText>
          </Utils.Row>
          <Utils.VerticalSpacer size='medium' />
          <Utils.Row justify='space-between'>
            <Elements.DescriptionText>TronGr17.com</Elements.DescriptionText>
            <Elements.CardText>0</Elements.CardText>
          </Utils.Row>
        </Utils.Column>
      </Utils.Content>
    )
  }

  render () {
    return (
      <Utils.Container>
        <ScrollView>
          {this._renderHeader()}
          {this._renderCard()}
          {this._renderToFrom()}
          {this._renderCreateBody()}
          {this._renderVotes()}
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
