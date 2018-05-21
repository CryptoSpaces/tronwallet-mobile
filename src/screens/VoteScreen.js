import React, { PureComponent } from 'react'
import { View, TextInput, FlatList, StyleSheet, Text, TouchableOpacity } from 'react-native'

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
    ]
  };

  renderRow = ({ item }) => {
    return (
      <View style={styles.row}>
        <Text style={styles.text}>{item.url}</Text>
        <View style={styles.item}>
          <Text style={styles.label}>Issuer: </Text>
          <Text style={styles.description}>
            {`${item.issuer.slice(0, 8)}...${item.issuer.substr(item.issuer.length - 8)}`}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <TouchableOpacity onPress={() => {}} style={styles.button}>
            <Text style={styles.textButton}>Vote</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  render () {
    const { voteList } = this.state
    return (
      <View>
        <TextInput style={styles.search} placeholder='Search a token' />
        <FlatList
          style={{ marginBottom: '7%' }}
          data={voteList}
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

export default VoteScreen
