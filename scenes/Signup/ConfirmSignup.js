import React, { Component } from 'react'
import { TouchableOpacity, View, Text, TextInput, ActivityIndicator } from 'react-native'
import * as Utils from '../../components/Utils'
import { Auth } from 'aws-amplify';
import { Colors } from '../../components/DesignSystem';


class SignupScene extends Component {

    state = {
        code: '',
        confirmError: null,
        loadingConfirm: false,

    }

    changeInput = (text, field) => {
        this.setState({
            [field]: text
        })
    }
    confirmSignup = async () => {
        const { code } = this.state;
        const { navigation } = this.props;
        const email = navigation.getParam('email');
        this.setState({ loadingConfirm: true });
        try {
            await Auth.confirmSignUp(email, code);
            const isSigned = await Auth.currentAuthenticatedUser();
            navigation.navigate('Login');
        } catch (error) {
            this.setState({ confirmError: error.message, loadingConfirm: false });
        }

    }
    render() {
        const { confirmError, loadingConfirm } = this.state;
        return (
            <Utils.Container>
                <Utils.Text>Confirm Signup</Utils.Text>
                <Utils.Container>
                    <Utils.Text size="xsmall" secondary>Code</Utils.Text>
                    <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType="numeric" onChangeText={(text) => this.changeInput(text, 'code')} />
                </Utils.Container>
                {loadingConfirm ?
                    <ActivityIndicator size='small' color={Colors.yellow} />
                    : <TouchableOpacity onPress={this.confirmSignup}>
                        <Utils.Text size="small">Confirm Sign Up</Utils.Text>
                    </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Utils.Text size="small">Back to Sign Up</Utils.Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', fontSize: 30 }}>{confirmError}</Text>
            </Utils.Container>
        )
    }
}

export default SignupScene
