import React from 'react'
import { ScrollView } from 'react-native'

import IconButton from '../../components/IconButton'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'
import * as Elements from './Elements'

class TransactionDetails extends React.Component {
  static navigationOptions = {
    header: null
  }

  render () {
    return (
      <Utils.Container>
        <Utils.Header>
          <Utils.Title>Transaction Details</Utils.Title>
        </Utils.Header>
        <ScrollView>
          <Utils.Content>
            <Elements.Label>HASH</Elements.Label>
            <Utils.VerticalSpacer />
            <Utils.Row align='center'>
              <Utils.View flex={1}>
                <Elements.Text>4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476</Elements.Text>
              </Utils.View>
              <Utils.HorizontalSpacer size='big' />
              <Utils.View>
                <IconButton icon='md-clipboard' bg='#66688F' iconColor='#FFFFFF' onPress={() => {}} />
              </Utils.View>
            </Utils.Row>
          </Utils.Content>
          <Utils.View height={1} background='#3FE77B' />
          <Utils.Content>
            <Utils.Row>
              <Utils.View>
                <Elements.Label>STATUS</Elements.Label>
                <Utils.VerticalSpacer />
                <Badge bg='#3FE77B'>
                  <Elements.BadgeText>Confirmed</Elements.BadgeText>
                </Badge>
              </Utils.View>
              <Utils.View flex={1} />
              <Utils.View>
                <Elements.Label>BLOCK</Elements.Label>
                <Utils.VerticalSpacer />
                <Elements.Text>335019</Elements.Text>
              </Utils.View>
              <Utils.View flex={1} />
              <Utils.View>
                <Elements.Label>TIME</Elements.Label>
                <Utils.VerticalSpacer />
                <Elements.Text>07/06/2018 2:00 PM</Elements.Text>
              </Utils.View>
            </Utils.Row>
          </Utils.Content>
          <Utils.View height={1} background='#51526B' />
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
