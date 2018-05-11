import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import Icon from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from './src/screens/HomeScreen';
import SecretsScreen from './src/screens/SecretsScreen';
import ReceiveScreen from './src/screens/ReceiveScreen';
import ViewTokensScreen from './src/screens/ViewTokensScreen';
import VoteScreen from './src/screens/VoteScreen';
import AboutScreen from './src/screens/AboutScreen';

const NavigationStack = TabNavigator(
  {
    Home: {
      screen: HomeScreen
    },
    Secrets: {
      screen: SecretsScreen
    },
    Receive: {
      screen: ReceiveScreen
    },
    ViewTokens: {
      screen: ViewTokensScreen
    },
    Vote: {
      screen: VoteScreen
    },
    About: {
      screen: AboutScreen
    }
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName,
          icon
        if (routeName === 'Receive') {
          icon = <FontAwesome name='qrcode' size={23} color={tintColor} />
        } else {
          if (routeName === 'Home') {
            iconName = `book`
          } else if (routeName === 'Secrets') {
            iconName = `shield`
          } else if (routeName === 'About') {
            iconName = `info`
          } else if (routeName === 'Receive') {
            iconName = `home`
          } else if (routeName === 'ViewTokens') {
            iconName = `list`
          } else if (routeName === 'Vote') {
            iconName = `thumbs-up`
          }
          icon = <Icon name={iconName} size={23} color={tintColor} />
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                {icon}
                <Text numberOfLines={1} style={{ fontSize:11, color: tintColor }}>{routeName}</Text>
              </View>
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }),
    initialRouteName: 'Home',
    tabBarPosition: 'bottom',
    tabBarComponent: TabBarBottom,
    animationEnabled: true,
    lazy: false,
    swipeEnabled: false,
    tabBarOptions: {
      activeTintColor: '#2e3666',
      inactiveTintColor: 'gray',
      showLabel: false,
      style: {
        height: 45,
        backgroundColor: 'white'
      }
    }
  }
);

const RootStack = createStackNavigator(
  {
    Main: {
      screen: NavigationStack
    }
  }
);

export default () => (
  <RootStack />
);
