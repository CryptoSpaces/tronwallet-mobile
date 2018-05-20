import React, { Component } from 'react'
import { TouchableOpacity, View, Text, TextInput, ActivityIndicator } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify';
import { Colors } from '../../components/DesignSystem';


class ConfirmNewPassword extends Component {

    state = {
        email: '',
        code: '',
        newPassword: '',
        forgotError: null,
        loadingForgot: false,

    }

    changeInput = (text, field) => {
        this.setState({
            [field]: text
        })
    }
    submitNewPassword = async () => {
        const { navigation } = this.props;
        const { code, newPassword } = this.state;
        const email = this.props.navigation.getParam('email');

        this.setState({ loadingForgot: true });
        try {
            await Auth.forgotPasswordSubmit(email, code, newPassword);
            this.setState({ loadingForgot: false });
            this.props.navigation.navigate('Login', { changedPassword: true });
        } catch (error) {
            let message = error.message;
            this.setState({ forgotError: message, loadingForgot: false });
        }

    }
    render() {
        const { forgotError, loadingForgot } = this.state;
        return (
            <Utils.Container>
                <Utils.Text>Submit new password</Utils.Text>
                <Utils.Text>An emai was sent to your email, please submit the code with the new password</Utils.Text>
                <Utils.Container>
                    <Utils.Text size="xsmall" secondary>Code</Utils.Text>
                    <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType="email-address" onChangeText={(text) => this.changeInput(text, 'code')} />
                    <Utils.Text size="xsmall" secondary>New Password</Utils.Text>
                    <TextInput style={{ color: 'white', fontSize: 30 }} secureTextEntry keyboardType="numeric" onChangeText={(text) => this.changeInput(text, 'newPassword')} />
                </Utils.Container>
                {loadingForgot ?
                    <ActivityIndicator size='small' color={Colors.yellow} />
                    : <TouchableOpacity onPress={this.submitNewPassword}>
                        <Utils.Text size="small">Change Password</Utils.Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Utils.Text size="small">Back to Login</Utils.Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', fontSize: 30 }}>{forgotError}</Text>
            </Utils.Container>
        )
    }
}

export default ConfirmNewPassword
