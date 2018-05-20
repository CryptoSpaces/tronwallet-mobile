import React, { Component } from 'react'
import { TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'

class SignupScene extends Component {
    state = {
      email: '',
      password: '',
      username: '',
      signError: null,
      loadingSign: false

    }

    changeInput = (text, field) => {
      this.setState({
        [field]: text
      })
    }
    signUp = async () => {
      const { email, password, username } = this.state
      this.setState({ loadingSign: true })
      try {
        await Auth.signUp({
          username: email,
          password,
          attributes: {
            email,
            nickname: username
          },
          validationData: []
        })
        this.setState({ signError: null, loadingSign: false })
        this.props.navigation.navigate('ConfirmSignup')
      } catch (error) {
        this.setState({ signError: error.message, loadingSign: false })
      }
    }
    render () {
      const { signError, loadingSign } = this.state
      return (
        <Utils.Container>
          <Utils.Text>Signup Scene</Utils.Text>
          <Utils.Container>
            <Utils.Text size='xsmall' secondary>Username</Utils.Text>
            <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'Username')} />
            <Utils.Text size='xsmall' secondary>Email</Utils.Text>
            <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
            <Utils.Text size='xsmall' secondary>Password</Utils.Text>
            <TextInput style={{ color: 'white', fontSize: 30 }} secureTextEntry onChangeText={(text) => this.changeInput(text, 'password')} />
          </Utils.Container>
          {loadingSign
            ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <TouchableOpacity onPress={this.signUp}>
              <Utils.Text size='small'>Signup</Utils.Text>
            </TouchableOpacity>
          }
          <Text style={{ color: 'red', fontSize: 30 }}>{signError}</Text>
        </Utils.Container>
      )
    }
}

export default SignupScene
