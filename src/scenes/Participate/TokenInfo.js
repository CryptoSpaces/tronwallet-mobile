import React, { PureComponent } from 'react'

import NavigationHeader from '../../components/Navigation/Header'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

class TokenInfo extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        title='TOKEN INFO'
        onBack={() => navigation.goBack()}
      />
    )
  })

  render () {
    return (
      <Utils.Container>
        <Utils.Content>
          <Utils.Row justify='center'>
            <Badge>WashingtonDC</Badge>
          </Utils.Row>
        </Utils.Content>
      </Utils.Container>
    )
  }
}
export default TokenInfo
