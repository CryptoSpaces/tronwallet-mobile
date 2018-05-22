import React, { PureComponent } from 'react'
import { FlatList, TouchableOpacity } from 'react-native'
import { LinearGradient } from 'expo'
import { Colors, Spacing } from '../../components/DesignSystem'
import * as Utils from '../../components/Utils'
import VoteDetailScreen from './VoteDetailScreen'

class VoteScreen extends PureComponent {
  state = {
    voteList: [
      {
        id: 1,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 2,
        url: 'http://google.com',
        issuer: '1231231231312312daskdhgasjdhgasjdhgasjdhgassadgasjdhags'
      },
      {
        id: 3,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 4,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 5,
        url: 'http://getty.io',
        issuer: '1231231231312312'
      },
      {
        id: 6,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 7,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 8,
        url: 'http://google.com',
        issuer: '1231231231312312'
      },
      {
        id: 9,
        url: 'http://google.com',
        issuer: '1231231231312312'
      }
    ],
    modalVisible: false,
    currentItem: null,
    search: ''
  };

  showModal = (currentItem) => {
    this.setState({
      currentItem,
      modalVisible: true
    })
  }

  onChange = (value, field) => {
    this.setState({
      [field]: value
    })
  }

  renderRow = ({ item }) => {
    return (
      <Utils.Item padding={16} borderBottomWidth={1}>
        <Utils.Row justify='space-between' align='center'>
          <Utils.Text secondary>#{item.id}</Utils.Text>
          <Utils.View justify='space-between' height={50}>
            <Utils.Text lineHeight={20}>{item.url}</Utils.Text>
            <Utils.Row>
              <Utils.Text secondary size='xsmall'>ISSUER: </Utils.Text>
              <Utils.Text size='xsmall'>
                {`${item.issuer.slice(0, 8)}...${item.issuer.substr(item.issuer.length - 8)}`}
              </Utils.Text>
            </Utils.Row>
          </Utils.View>
          <TouchableOpacity onPress={() => this.showModal(item)}>
            <LinearGradient
              start={[0, 1]}
              end={[1, 0]}
              colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]}
              style={{ padding: Spacing.small, alignItems: 'center', borderRadius: 5, width: '100%' }}
            >
              <Utils.Text size='xsmall'>Vote</Utils.Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <Utils.Button
            onPress={() => {}}
            width={80}
            height={40}
            radius={10}
            secundary
            align="center"
            justify="center"
          >
            <Utils.Text size="xsmall">Vote</Utils.Text>
          </Utils.Button> */}
        </Utils.Row>
      </Utils.Item>
    )
  }

  render () {
    const { voteList, modalVisible, currentItem } = this.state
    return (
      <Utils.Container>
        <Utils.StatusBar transparent />
        <Utils.FormInput
          underlineColorAndroid='transparent'
          keyboardType='numeric'
          onChangeText={(text) => this.onChange(text, 'search')}
          placeholder='Search a token'
          placeholderTextColor='#fff'
        />
        <FlatList
          data={voteList}
          removeClippedSubviews
          renderItem={this.renderRow}
          keyExtractor={item => `${item.id}`}
        />
        <VoteDetailScreen
          visible={modalVisible}
          item={currentItem}
        />
      </Utils.Container>
    )
  }
}

export default VoteScreen
