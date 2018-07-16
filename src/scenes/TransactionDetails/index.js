import React from 'react'
import { ScrollView, TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import Feather from 'react-native-vector-icons/Feather'

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
          onClose={() => navigation.goBack()}
          rightButton={
            <TouchableOpacity onPress={() => { }}>
              <Feather name='share-2' color='white' size={21} />
            </TouchableOpacity>
          }
        />
      )
    }
  }

  _renderCard = () => {
    return (
      <Utils.View
        background={Colors.secondaryText}
        borderRadius={10}
        marginRight={25}
        marginLeft={25}
        borderTopWidth={10}
        borderTopColor='#3FE77B'
      >
        <Utils.Content>
          <Elements.CardLabel>HASH</Elements.CardLabel>
          <Utils.VerticalSpacer />
          <Utils.Row align='center'>
            <Utils.View flex={1}>
              <Elements.CardText>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.CardText>
            </Utils.View>
            <Utils.HorizontalSpacer size='big' />
            <Utils.View>
              <IconButton icon='md-clipboard' bg='#66688F' iconColor='#FFFFFF' onPress={() => { }} />
            </Utils.View>
          </Utils.Row>
        </Utils.Content>
        <Utils.View height={1} marginLeftPercent={5} width='90%' background='black' />
        <Utils.Content>
          <Utils.Row>
            <Utils.View>
              <Elements.CardLabel>STATUS</Elements.CardLabel>
              <Utils.VerticalSpacer />
              <Elements.CardText>Confirmed</Elements.CardText>
            </Utils.View>
            <Utils.View flex={1} />
            <Utils.View>
              <Elements.CardLabel>BLOCK</Elements.CardLabel>
              <Utils.VerticalSpacer />
              <Elements.CardText>335019</Elements.CardText>
            </Utils.View>
            <Utils.View flex={1} />
            <Utils.View>
              <Elements.CardLabel>TIME</Elements.CardLabel>
              <Utils.VerticalSpacer />
              <Elements.CardText>07/06/2018 2:00 PM</Elements.CardText>
            </Utils.View>
          </Utils.Row>
        </Utils.Content>
      </Utils.View>
    )
  }

  _renderHeader = () => {
    return (
      <Utils.Content align='center'>
        <Badge bg='#3FE77B'>
          <Elements.BadgeText>VOTE</Elements.BadgeText>
        </Badge>
        <Utils.VerticalSpacer size='medium' />
        <Elements.CardLabel>AMOUNT</Elements.CardLabel>
        <Utils.VerticalSpacer />
        <Utils.Row align='center'>
          <Elements.AmountText>94.00</Elements.AmountText>
          <Utils.HorizontalSpacer size='medium' />
          <Badge bg={Colors.secondaryText}>
            <Elements.BadgeText>TRX</Elements.BadgeText>
          </Badge>
          <Utils.HorizontalSpacer size='medium' />
          <Ionicons
            name='ios-arrow-round-down'
            size={45}
            color='red'
          />
        </Utils.Row>
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
          <Utils.Content>
            <Elements.Heading>Contracts</Elements.Heading>
            <Elements.SubHeading>Vote for a witness</Elements.SubHeading>
            <Utils.VerticalSpacer size='medium' />
            <Elements.Label>OWNER ADDRESS</Elements.Label>
            <Utils.VerticalSpacer />
            <Elements.Text>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.Text>
          </Utils.Content>
          <Utils.View height={1} background='#51526B' />
          <Utils.Content>
            <Elements.Heading>Votes</Elements.Heading>
            <Utils.Row align='center'>
              <Utils.View flex={1}>
                <Elements.Text>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.Text>
              </Utils.View>
              <Utils.HorizontalSpacer />
              <Utils.View>
                <Elements.Label>COUNT</Elements.Label>
                <Elements.Text>80,000</Elements.Text>
              </Utils.View>
            </Utils.Row>
            <Utils.VerticalSpacer size='medium' />
            <Utils.View height={1} background='#51526B' />
            <Utils.VerticalSpacer size='medium' />
            <Utils.Row align='center'>
              <Utils.View flex={1}>
                <Elements.Text>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.Text>
              </Utils.View>
              <Utils.HorizontalSpacer />
              <Utils.View>
                <Elements.Label>COUNT</Elements.Label>
                <Elements.Text>80,000</Elements.Text>
              </Utils.View>
            </Utils.Row>
          </Utils.Content>
        </ScrollView>
      </Utils.Container>
    )
  }
}

export default TransactionDetails
