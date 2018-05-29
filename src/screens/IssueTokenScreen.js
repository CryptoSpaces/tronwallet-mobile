import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native'
import Button from 'react-native-micro-animated-button'
import * as Utils from '../../components/Utils'

class IssueTokenScreen extends PureComponent {
  state = {};

  render () {
    return (
      <Utils.Container>
        <View style={styles.form}>
          <Text style={styles.title}>Details</Text>
          <View style={styles.formItem}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid='rgba(0,0,0,0)'
              value='Name'
              onChangeText={() => {}}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.label}>Total Supply</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid='rgba(0,0,0,0)'
              value='Total Supply'
              onChangeText={() => {}}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid='rgba(0,0,0,0)'
              value='Description'
              onChangeText={() => {}}
            />
          </View>
          <View style={styles.formItem}>
            <Text style={styles.label}>URL</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid='rgba(0,0,0,0)'
              value='URL'
              onChangeText={() => {}}
            />
          </View>
          <Text style={styles.title}>Exchange Rate</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.formItemExchange}>
              <Text style={styles.label}>TRX-Token Value</Text>
              <TextInput
                style={styles.input}
                underlineColorAndroid='rgba(0,0,0,0)'
                value='TRX-Token Value'
                onChangeText={() => {}}
              />
            </View>
            <View style={styles.formItemExchange}>
              <Text style={styles.label}>New Token Value</Text>
              <TextInput
                style={styles.input}
                underlineColorAndroid='rgba(0,0,0,0)'
                value='New Token Value'
                onChangeText={() => {}}
              />
            </View>
          </View>
          <Text style={styles.title}>Participation</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <View style={styles.formItemExchange}>
              <Text style={styles.label}>Start Date</Text>
              <TextInput
                style={styles.input}
                underlineColorAndroid='rgba(0,0,0,0)'
                value='Start Date'
                onChangeText={() => {}}
              />
            </View>
            <View style={styles.formItemExchange}>
              <Text style={styles.label}>End Date</Text>
              <TextInput
                style={styles.input}
                underlineColorAndroid='rgba(0,0,0,0)'
                value='End Date'
                onChangeText={() => {}}
              />
            </View>
          </View>
          <View style={styles.formItem}>
            <Text style={styles.label}>Select Account</Text>
            <TextInput
              style={styles.input}
              underlineColorAndroid='rgba(0,0,0,0)'
              value='Select Account'
              onChangeText={() => {}}
            />
          </View>
          <Text style={{ textAlign: 'center' }}>I confirm that creating the total supply of the token costs a one time total fee of 1024 TRX.</Text>
          <Button
            foregroundColor='#fff'
            backgroundColor='#276cf2'
            successColor='#276cf2'
            errorColor='#ff3b30'
            errorIconColor='#fff'
            successIconColor='#fff'
            successIconName='check'
            label='Issue Token'
            style={{ width: '100%' }}
            onPress={() => {}}
          />
        </View>
      </Utils.Container>
    )
  }
}

const styles = StyleSheet.create({
  form: {
    display: 'flex',
    padding: 10
  },
  formItem: {
    marginBottom: 10,
    width: '100%'
  },
  formItemExchange: {
    marginBottom: 10,
    width: '50%'
  },
  title: {
    fontSize: 17,
    color: '#344B67',
    fontWeight: '700',
    paddingBottom: 10
  },
  label: {
    fontWeight: '600',
    color: '#344B67',
    paddingBottom: 2
  },
  input: {
    height: 40,
    padding: 8,
    backgroundColor: 'white',
    color: '#a0a0a0',
    borderWidth: 1,
    borderColor: '#cecece',
    marginBottom: 8,
    borderRadius: 8
  }
})

export default IssueTokenScreen
