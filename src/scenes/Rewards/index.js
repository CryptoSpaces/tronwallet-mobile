import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { ImageBackground } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import Ionicons from 'react-native-vector-icons/Ionicons'
import * as Utils from '../../components/Utils'
import { Colors, Spacing } from '../../components/DesignSystem'

class RewardsScreen extends PureComponent {

  render() {
    const { label, amount, token } = this.props.navigation.state.params

    return (
      <Utils.Container align='stretch'>
        <LinearGradient 
          start={{x: 0, y: 0}} 
          end={{x: 1, y: 1}} 
          colors={[Colors.primaryGradient[0], Colors.primaryGradient[1]]} 
          style={{flex: 1, width: '100%', alignItems: 'center', justifyContent: 'center'}}
        >
          <Utils.Row 
            justify='space-between' 
            width='100%' 
            position='absolute'
            top='0'
            paddingY='big'
            paddingX='medium'
          >
            <Utils.ButtonWrapper onPress={() => {}}>
              <Ionicons name='ios-menu' size={Spacing.large} color={Colors.primaryText} />
            </Utils.ButtonWrapper>
            <Utils.ButtonWrapper onPress={() => {}}>
              <Ionicons name='ios-add' size={40} color={Colors.primaryText} />
            </Utils.ButtonWrapper>
          </Utils.Row>
          <Utils.View 
            align='center' 
            justify='center' 
            width={450} 
            height={450} 
            position='relative'
          >
            <Utils.Img 
              source={require('../../assets/tron-logo-small.png')} 
              position='absolute'
              top='0'
              width='42px' 
              height='42px'
            />
            <Utils.Text
              position='absolute'
              top={60}
              fontSize={11}
            >REWARDS</Utils.Text>
            <ImageBackground
              source={require('../../assets/circle-illustration.png')}
              resizeMode='contain'
              paddingSize='none'
              style={{flex: 1, paddingTop: 50}}
            >
              <Utils.View 
                align='center'
                justify='center'
              >
                <ImageBackground
                  source={require('../../assets/bg-account.png')}
                  style={{width: 300, height: 300}}
                >
                  <Utils.View
                    marginTop={65}
                    align='center'
                  >
                    <Utils.Text 
                      font='Rubik-Light'
                      align='center'
                      size='average'
                    >{label}</Utils.Text> 
                    <Utils.Text
                      align='center'
                      size='xsmall'
                      weight='bold'
                    >You have earned!</Utils.Text>
                    <Utils.Text
                      size='huge'
                      align='center'
                      marginY={15}
                    >{amount}</Utils.Text>
                    <Utils.View
                        backgroundColor={Colors.primaryText}
                        borderRadius={3}
                        width={65}
                        padding={8} 
                        elevation={5} 
                        style={{shadowOffset: {  width: 15,  height: 15,  }, shadowColor: 'black', shadowRadius: 15, shadowOpacity: 0.5}}>
                      <Utils.Text
                        size='smaller'
                        align='center'
                        color={Colors.orange}
                      >{token}</Utils.Text>
                    </Utils.View>
                  </Utils.View>
                </ImageBackground>
              </Utils.View>
            </ImageBackground>
          </Utils.View>
            <Utils.ContentWithBackground
              source={require('../../assets/back-arrow-bg.png')}
              resizeMode='contain'
              justify='center'
              align='center'
              position='absolute'
              bottom={25}
              right={25}
              width={120}
              height={120}
            >
              <Utils.ButtonWrapper onPress={() => {}}>
                <Ionicons name='ios-arrow-round-forward' size={Spacing.large} color={Colors.primaryText} />
              </Utils.ButtonWrapper>
            </Utils.ContentWithBackground>
        </LinearGradient>
      </Utils.Container>
    )
  }
}

RewardsScreen.propTypes = {
  navigation: PropTypes.shape({
    state: PropTypes.shape({
      params: PropTypes.shape({
        label: PropTypes.string.isRequired,
        amount: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.number
        ]).isRequired,
        token: PropTypes.string.isRequired
      })
    })
  })
}

export default RewardsScreen
