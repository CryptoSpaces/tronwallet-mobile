import React, { Component } from 'react'
import { Ionicons, Feather } from '@expo/vector-icons'
import { LineChart } from 'react-native-svg-charts'
import { tint } from 'polished'
import { FlatList } from 'react-native'

import Gradient from '../../components/Gradient'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Header from '../../components/Header'

class BalanceScene extends Component {
  render () {
    return (
      <Utils.Container>
        <Utils.StatusBar />
        <Header
          onLeftPress={() => {}}
          leftIcon={<Ionicons name='ios-menu' color={Colors.primaryText} size={24} />}
          onRightPress={() => {}}
          rightIcon={<Feather name='plus' color={Colors.primaryText} size={24} />}
        >
          <Utils.View align='center'>
            <Utils.Text size='xsmall' secondary>TRX BALANCE</Utils.Text>
            <Utils.Text size='medium'>$ 25 821,23</Utils.Text>
          </Utils.View>
        </Header>
        <Utils.Content>
          <Utils.Content>
            <LineChart
              style={{ height: 30 }}
              data={[ 50, 10, 40, 95, -4, -24, 85, 91, 35, 53, -53, 24, 50, -20, -80 ]}
              svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
              animate
            >
              <Gradient />
            </LineChart>
          </Utils.Content>
          <Utils.VerticalSpacer size='medium' />
          <FlatList
            data={[
              { coin: 'TRX', amount: 4808.00 },
              { coin: 'GTO', amount: 300.23 },
              { coin: 'IOX', amount: 0.258538 }
            ]}
            renderItem={({ item }) => (
              <Utils.Row align='center' justify='space-between'>
                <Utils.Label color={tint(0.9, Colors.background)}>
                  <Utils.Text>{item.coin}</Utils.Text>
                </Utils.Label>
                <Utils.Text>{`$ ${item.amount}`}</Utils.Text>
              </Utils.Row>
            )}
            keyExtractor={item => item.coin}
            ItemSeparatorComponent={() => <Utils.VerticalSpacer size='large' />}
            scrollEnabled={false}
          />
        </Utils.Content>
      </Utils.Container>
    )
  }
}

export default BalanceScene
