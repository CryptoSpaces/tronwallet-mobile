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
        <Utils.View flex={1}>
          <Utils.Row marginY='medium'>
            <Utils.View flex={1} justify='center' >
              <Utils.Text>Scan the QRCode to identify the target user.</Utils.Text>
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
              <Utils.View flex={1} background='transparent' justify='center' align='center'>
                <Utils.View width={250} height={250} borderWidth={2} borderColor={'white'}/>
                <Utils.Text marginTop='medium'>Scan the QRCode to identify the target user.</Utils.Text>
              </Utils.View>
            )}
            cameraStyle={{ height: '90%', width: '100%', justifyContent: 'flex-start'}}
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