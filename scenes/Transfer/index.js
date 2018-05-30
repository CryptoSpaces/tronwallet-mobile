import * as React from 'react'
import { Dimensions, SafeAreaView } from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view'
import FreezeScreen from '../Freeze'
import SendScreen from '../Send'
import ReceiveScreen from '../Receive'
import * as Utils from '../../components/Utils'

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width
}

export default class TransferScene extends React.Component {
  static navigationOptions = ({ navigation }) => {
	  return {
	    header: (
        <SafeAreaView style={{ backgroundColor: 'black' }}>
          <Utils.Header>
            <Utils.TitleWrapper>
              <Utils.Title>Account</Utils.Title>
            </Utils.TitleWrapper>
          </Utils.Header>
        </SafeAreaView>
	    )
	  }
  }

  state = {
    index: 0,
    routes: [
      { key: 'send', title: 'Send' },
      { key: 'receive', title: 'Receive' },
      { key: 'freeze', title: 'Freeze' }
    ]
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} style={{ backgroundColor: 'black', flex: 0.1 }} />;

  _renderScene = SceneMap({
    send: () => <SendScreen {...this.props} />,
    receive: () => <ReceiveScreen {...this.props} />,
    freeze: () => <FreezeScreen {...this.props} />
  });

  render () {
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        initialLayout={initialLayout}
        style={{ backgroundColor: 'black' }}
      />
    )
  }
}
