import React, { Component } from 'react'
import { TouchableOpacity, Text, TextInput, ActivityIndicator } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify'
import { Colors } from '../../components/DesignSystem'

class SignupScene extends Component {
    state = {
      email: '',
      forgotError: null,
      loadingForgot: false

    }

    changeInput = (text, field) => {
      this.setState({
        [field]: text
      })
    }

    forgotPassword = async () => {
      const { email } = this.state
      const { navigation } = this.props
      this.setState({ loadingForgot: true })
      try {
        await Auth.forgotPassword(email)
        this.setState({ loadingForgot: false })

        navigation.navigate('ConfirmNewPassword', { email })
      } catch (error) {
        let message = error.message
        if (error.code === 'UserNotFoundException') {
          message = 'Email not valid'
        }
        this.setState({ forgotError: message, loadingForgot: false })
      }
    }
    render () {
      const { forgotError, loadingForgot } = this.state
      return (
        <Utils.Container>
          <Utils.Text>Change Password</Utils.Text>
          <Utils.Text>Provide your email to proceed with the recovery</Utils.Text>
          <Utils.Container>
            <Utils.Text size='xsmall' secondary />
            <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType='email-address' onChangeText={(text) => this.changeInput(text, 'email')} />
          </Utils.Container>
          {loadingForgot
            ? <ActivityIndicator size='small' color={Colors.yellow} />
            : <TouchableOpacity onPress={this.forgotPassword}>
              <Utils.Text size='small'>Send confirmation code</Utils.Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <Utils.Text size='small'>Back to Login</Utils.Text>
          </TouchableOpacity>
          <Text style={{ color: 'red', fontSize: 30 }}>{forgotError}</Text>
        </Utils.Container>
      )
    }
}

export default SignupScene
