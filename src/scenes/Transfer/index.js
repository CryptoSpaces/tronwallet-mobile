import * as React from 'react'
import { Dimensions } from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import FreezeScreen from '../Freeze/index'
import { Colors } from '../../components/DesignSystem'
import SendScreen from '../Send/index'
import NavigationHeader from '../../components/Navigation/Header'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

const SCREENSIZE = Dimensions.get('window')
const TAB_WIDTH = SCREENSIZE.width / 2
const INDICATOR_WIDTH = 100

export default class TransferScene extends React.Component {
  static navigationOptions = () => {
    return {
      header: <NavigationHeader title='TRANSFERS' noBorder />
    }
  }

  state = {
    index: 0,
    routes: [
      { key: 'send', title: 'Send' },
      { key: 'freeze', title: 'Freeze' }
    ]
  }

  _handleIndexChange = index => this.setState({ index })

  _renderHeader = props => (
    <TabBar
      {...props}
      indicatorStyle={{
        width: INDICATOR_WIDTH,
        height: 1,
        marginLeft: (TAB_WIDTH / 2 - INDICATOR_WIDTH / 2)
      }}
      tabStyle={{
        padding: 16
      }}
      labelStyle={{
        fontFamily: 'Rubik-Medium',
        fontSize: 12,
        letterSpacing: 0.65,
        lineHeight: 12
      }}
      style={{
        borderBottomWidth: 1,
        borderColor: Colors.lighterBackground,
        backgroundColor: Colors.background,
        elevation: 0,
        shadowOpacity: 0
      }}
    />
  )

  _renderScene = SceneMap({
    send: () => <SendScreen {...this.props} />,
    freeze: () => <FreezeScreen {...this.props} />
  })

  render () {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
      />
    )
  }
}
