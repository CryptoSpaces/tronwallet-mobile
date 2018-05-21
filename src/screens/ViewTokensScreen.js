import React, { PureComponent } from 'react'
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native'
import moment from 'moment'

class ViewTokensScreen extends PureComponent {
  state = {
    tokenList: [
      {
        id: 1,
        name: 'Teste 1',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 2,
        name: 'Teste 2',
        issuer: '1231231231312312daskdhgasjdhgasjdhgasjdhgassadgasjdhags',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 3,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 4,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 5,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 6,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 7,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 8,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      },
      {
        id: 9,
        name: 'Teste 3',
        issuer: '1231231231312312',
        total: 1000,
        price: 10,
        startDate: new Date(),
        endDate: new Date()
      }
    ]
  };

  renderRow = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{item.name}</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Issuer: </Text>
          <Text style={styles.description}>
            {`${item.issuer.slice(0, 8)}...${item.issuer.substr(item.issuer.length - 8)}`}
          </Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Total: </Text>
          <Text style={styles.description}>{item.total}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Price: </Text>
          <Text style={styles.description}>{item.price}TRX</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>Start Date: </Text>
          <Text style={styles.description}>{moment(item.startDate).format('YYYY-MM-DD HH:mm')}</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.label}>End Date: </Text>
          <Text style={styles.description}>{moment(item.endDate).format('YYYY-MM-DD HH:mm')}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.textButton}>Participate</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { tokenList } = this.state
    return (
      <View>
        <TextInput style={styles.search} placeholder='Search a token' />
        <FlatList
          style={{ marginBottom: '7%' }}
          data={tokenList}
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
    borderBottomWidth: 1,
    borderColor: '#d3d3d3',
    backgroundColor: '#fff'
  },
  item: {
    flexDirection: 'row'
  },
  text: {
    fontWeight: '800',
    fontSize: 16,
    paddingBottom: 10,
    color: '#2C2C2C'
  },
  description: {
    paddingBottom: 5,
    color: '#2C2C2C'
  },
  label: {
    fontWeight: '700',
    color: '#2C2C2C'
  },
  textButton: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600'
  },
  button: {
    width: 100,
    height: 40,
    backgroundColor: '#2C2C2C',
    borderColor: '#2C2C2C',
    borderRadius: 10,
    borderWidth: 2,
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },
  search: {
    height: 50,
    padding: 8,
    backgroundColor: 'white',
    color: '#a0a0a0',
    borderWidth: 1,
    borderColor: '#cecece'
  }
})

export default ViewTokensScreen
