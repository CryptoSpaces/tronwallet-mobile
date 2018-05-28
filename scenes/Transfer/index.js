import React, { PureComponent } from 'react'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import { TabViewAnimated, TabBar, SceneMap } from 'react-native-tab-view';
import ReceiveScreen from '../Receive';
import SendScreen from '../Send';
import FreezeScreen from '../Freeze';

const initialLayout = {
  height: 0,
  width: Dimensions.get('window').width,
};

const FirstRoute = () => <View style={[ styles.container, { backgroundColor: '#ff4081' } ]} />;
const SecondRoute = () => <View style={[ styles.container, { backgroundColor: '#673ab7' } ]} />;
const RawSend = () => <SendScreen noNavigation />;

class TransferScene extends PureComponent {
  state = {
    index: 0,
    routes: [
      { key: 'send', title: 'Send' },
      { key: 'receive', title: 'Receive' },
      { key: 'freeze', title: 'Freeze' },
    ], 
  };

  _handleIndexChange = index => this.setState({ index });

  _renderHeader = props => <TabBar {...props} style={{ backgroundColor: 'black', marginTop: '5%', flex: 0.1 }} />;

  _renderScene = SceneMap({
    send: RawSend,
    receive: ReceiveScreen,
    freeze: FreezeScreen
  });

  render () {
    // const { width } = Dimensions.get('window')
    return (
      <TabViewAnimated
        navigationState={this.state}
        renderScene={this._renderScene}
        renderHeader={this._renderHeader}
        onIndexChange={this._handleIndexChange}
        style={{ backgroundColor: 'black' }}
      />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: {
    fontSize: 16,
    color: '#2C2C2C',
    fontWeight: '700',
    padding: 30
  }
})

export default TransferScene
