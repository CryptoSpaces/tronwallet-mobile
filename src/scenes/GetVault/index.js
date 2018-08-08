import React from 'react'

import {
  Platform,
  Image,
  TouchableOpacity,
  Linking,
  Dimensions
} from 'react-native'

import tl from '../../utils/i18n'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Utils from '../../components/Utils'
import { Colors } from '../../components/DesignSystem'
import Header from '../../components/Header'

import logoIOS from '../../assets/logo-ios.png'
import logoAndroid from '../../assets/logo-android.png'
import tronLogo from '../../assets/tron-logo-small.png'

const ANDROID_URL = 'market://details?id=com.tronmobile'
const IOS_URL = 'itms://itunes.apple.com/us/app/tronvault/id1380161153?ls=1&mt=8'
const { width } = Dimensions.get('window')

export default props => {
  const onPress = async () => {
    if (Platform.OS === 'ios') {
      await Linking.openURL(IOS_URL)
    } else {
      await Linking.openURL(ANDROID_URL)
    }
  }

  return (
    <Utils.Container>
      <Utils.StatusBar transparent />
      <Header
        onLeftPress={() => props.navigation.goBack()}
        leftIcon={
          <Ionicons name='ios-close' color={Colors.primaryText} size={40} />
        }
        rightIcon={<Utils.View />}
      >
        <Utils.View align='center'>
          <Utils.Text size='medium'>Tron Vault</Utils.Text>
        </Utils.View>
      </Header>
      <Utils.Content align='center' justify='center'>
        <Image
          style={{ width: width * 0.2, height: width * 0.2 }}
          source={tronLogo}
        />
        <Utils.VerticalSpacer size='medium' />
        <Utils.Text size='xsmall'>
          {tl.t('getVault.notInstalled')}
        </Utils.Text>
        <Utils.VerticalSpacer size='large' />
        <Utils.Text size='small' font='light'>
          {tl.t('getVault.downloadHere')}
        </Utils.Text>
        <Utils.VerticalSpacer size='medium' />
        <TouchableOpacity onPress={onPress}>
          {Platform.OS === 'ios' ? (
            <Image
              style={{ height: 60 }}
              resizeMode='contain'
              source={logoIOS}
            />
          ) : (
            <Image
              style={{ height: 60 }}
              resizeMode='contain'
              source={logoAndroid}
            />
          )}
        </TouchableOpacity>
      </Utils.Content>
    </Utils.Container>
  )
}
