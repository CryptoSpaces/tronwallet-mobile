import React, { PureComponent } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import moment from 'moment'

class SecretsScreen extends PureComponent {
  state = {
    secretList: [
      {
        id: 1,
        name: 'Teste 1',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 2,
        name: 'Teste 2',
        address: '1231231231312312daskdhgasjdhgasjdhgasjdhgassadgasjdhags',
        date: new Date()
      },
      {
        id: 3,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 4,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 5,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 6,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 7,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 8,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      },
      {
        id: 9,
        name: 'Teste 3',
        address: '1231231231312312',
        date: new Date()
      }
    ]
  }

  renderRow = ({ item }) => {
    return (
      <View style={styles.row}>
        <TouchableOpacity>
          <Text style={styles.text}>{item.name}</Text>
          <Text style={styles.description}>
            {`${item.address.slice(0, 8)}...${item.address.substr(item.address.length - 8)}`}
          </Text>
          <Text>{moment(item.date).format('YYYY-MM-DD HH:mm')}</Text>
        </TouchableOpacity>
      </View>
    )
  }

  render () {
    const { secretList } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          data={secretList}
          removeClippedSubviews
          renderItem={this.renderRow}
          keyExtractor={item => `${item.id}`}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff'
  },
  row: {
    padding: 16,
    borderBottomWidth: 0.3,
    borderColor: '#d3d3d3',
    backgroundColor: '#fff'
  },
  text: {
    fontWeight: '700',
    fontSize: 16,
    paddingBottom: 10,
    color: '#2C2C2C'
  },
  description: {
    paddingBottom: 5,
    color: '#2C2C2C'
  }
})

export default SecretsScreen
