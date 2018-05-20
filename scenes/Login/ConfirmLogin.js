import React, { Component } from 'react'
import { TouchableOpacity, View, Text, TextInput, ActivityIndicator, Clipboard } from 'react-native'
import { Auth } from 'aws-amplify';
import { Colors } from '../../components/DesignSystem';
import * as Utils from '../../components/Utils'


class ConfirmLogin extends Component {

    state = {
        totpCode: null,
        user: {},
        code: null,
        confirmError: null,
        loadingConfirm: false,
        loadingData: true,
    }

    componentDidMount() {
        this.loadUserData();
    }

    changeInput = (text, field) => {
        this.setState({
            [field]: text
        })
    }

    confirmLogin = async () => {
        const { totpCode, user, code } = this.state;
        this.setState({ loadingConfirm: true });
        try {
            totpCode ? await Auth.verifyTotpToken(user, code) : await Auth.confirmSignIn(user, code, 'SOFTWARE_TOKEN_MFA')
            this.setState({ loadingConfirm: false, confirmError: null });
            this.props.navigation.navigate('App')
        } catch (error) {
            let message = error.message;
            if (error.code === 'EnableSoftwareTokenMFAException') {
                message = 'Wrong code. Try set up your athenticator again with the code above'
            }
            this.setState({ confirmError: message, loadingConfirm: false });
        }

    }

    copyClipboard = async () => {
        const { totpCode } = this.state;
        await Clipboard.setString(totpCode);
        alert('Copied to clipboard');
    }

    loadUserData = async () => {
        try {
            const user = this.props.navigation.getParam('user');
            let totpCode = null;
            if (user.challengeParam.MFAS_CAN_SETUP) {
                totpCode = await Auth.setupTOTP(user);
            }
            this.setState({ user, totpCode })
        } catch (error) {
            this.setState({ confirmError: error.message })
        }

    }

    render() {
        const { confirmError, loadingConfirm, totpCode } = this.state;
        return (
            <Utils.Container>
                <Utils.Text>Confirm Login</Utils.Text>
                <Utils.Container>
                    <Utils.Text size="xsmall" secondary>Authenticator Code</Utils.Text>
                    <TextInput style={{ color: 'white', fontSize: 30 }} keyboardType="email-address" onChangeText={(text) => this.changeInput(text, 'code')} />
                </Utils.Container>

                {totpCode && <Utils.Container>
                    <Utils.Text size="small" secondary>TOTP Secret</Utils.Text>
                    <Utils.Text size="xsmall">You need to link your account with some TOTP authenticator. We recomend Google Authenticator</Utils.Text>
                    <TextInput multiline style={{ color: 'white', fontSize: 30 }} value={totpCode} editable={false} />
                    <TouchableOpacity onPress={this.copyClipboard}>
                        <Utils.Text size="small">Copy</Utils.Text>
                    </TouchableOpacity>
                </Utils.Container>}
                {loadingConfirm ? <ActivityIndicator size='small' color={Colors.yellow} />
                    : <TouchableOpacity onPress={this.confirmLogin}>
                        <Utils.Text size="small">Confirm Login</Utils.Text>
                    </TouchableOpacity>}
                <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                    <Utils.Text size="small">Back to Login</Utils.Text>
                </TouchableOpacity>
                <Text style={{ color: 'red', fontSize: 30 }}>{confirmError}</Text>
            </Utils.Container>
        )
    }
}

export default ConfirmLogin
