import React from 'react'
import { View, Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import Ionicons from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types';
import { Colors } from '../components/DesignSystem'
import * as Utils from '../components/Utils'

const QRCodeComponent = ({onRead, onClose}) => (
  <Utils.Container>
    <Utils.Content flex={1}>
        <Utils.View style={{ flex: 1, justifyContent: 'center'}}>
          <Utils.Row marginY='medium'>
            <Utils.View flex={1} justify='center' >
              <Utils.Text size='xsmall'>Scan the QRCode to identify the target user.</Utils.Text>
            </Utils.View>
            <Utils.CloseButton onPress={onClose}>
              <Ionicons name='ios-close' size={32} color={Colors.primaryText} />
            </Utils.CloseButton>
          </Utils.Row>
          <QRCodeScanner
            showMarker
            reactivate
            fadeIn
            customMarker={(
              <View style={{ flex: 1, backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: 250, height: 250, borderWidth: 2, borderColor: 'white' }} />
                <Text style={{ color: 'white', marginTop: 16 }}>Scan the QRCode to identify the target user.</Text>
              </View>
            )}
            cameraStyle={{ height: '100%', width: '100%' }}
            permissionDialogMessage="To scan the public key the app needs your permission to access the camera."
            onRead={onRead}
          />
        </Utils.View>
    </Utils.Content>
  </Utils.Container>
)

QRCodeComponent.propTypes = {
  onRead: PropTypes.func.isRequired
}

export default QRCodeComponent