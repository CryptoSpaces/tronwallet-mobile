import React, { PureComponent } from 'react'
import { ScrollView } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'

import NavigationHeader from '../../../components/Navigation/Header'
import { BoldInfoRow, RegularInfoRow, SmallRegInfoRow } from '../../../components/KeyPairInfoRow'
import Badge from '../../../components/Badge'
import { Colors } from '../../../components/DesignSystem'
import * as Utils from '../../../components/Utils'

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
      <ScrollView>
        <Utils.Container justify='flex-start'>
          <Utils.VerticalSpacer />
          <Utils.Row justify='center'>
            <Badge bg={Colors.lightestBackground} large>WashingtonDC</Badge>
          </Utils.Row>
          <Utils.VerticalSpacer size='big' />
          <BoldInfoRow pairs={[
            {key: 'PRICE PER TOKEN', value: '0.10 TRX'},
            {key: 'FROZEN', value: '50%'}]}
          />
          <Utils.Content paddingVertical='small'>
            <Utils.SectionTitle>PERCENTAGE</Utils.SectionTitle>
            <Utils.Row align='center'>
              <ProgressBar
                progress={0.7}
                borderWidth={0}
                height={3}
                color={Colors.confirmed}
                unfilledColor={Colors.lightestBackground}
                style={{flex: 1}}
              />
              <Utils.HorizontalSpacer size='medium' />
              <Utils.BoldText>70%</Utils.BoldText>
            </Utils.Row>
          </Utils.Content>
          <BoldInfoRow pairs={[
            {key: 'ISSUED', value: '3003024256'},
            {key: 'TOTAL SUPPLY', value: '30000000000'}]}
          />
          <Utils.VerticalSpacer size='xsmall' />
          <SmallRegInfoRow pairs={[
            {key: 'START TIME', value: '07/06/2018 2:00 PM'},
            {key: 'END TIME', value: '07/06/2018 2:00 PM'}]}
          />
          <Utils.VerticalSpacer size='small' />
          <RegularInfoRow pairs={[
            {key: 'DESCRIPTION', value: 'Lorem ipsum dolor sit amet, consecteur adispicing elit. Quisque laoeret sucpir odio. finis but Curabitur efficitur eusirmod porta. Vivamus consequat dolor lacus, a tincituc ex elciifiu sed.'}]}
          />
          <Utils.VerticalSpacer size='small' />
          <RegularInfoRow pairs={[
            {key: 'TRANSACTION', value: '4a1746f2f2842a8526185cf6f9f91b3217af564daa3c236358dbe3435e151476'}]}
          />
          <Utils.VerticalSpacer size='small' />
          <RegularInfoRow pairs={[
            {key: 'OWNER ADDRESS', value: '4a1746f2f2842a8526185cf6f9f91b3217af564'}]}
          />
          <Utils.VerticalSpacer size='small' />
          <BoldInfoRow pairs={[
            {key: 'TRXNUM', value: '1'},
            {key: 'NUM', value: '10'},
            {key: 'BLOCK', value: 103660}]}
          />
        </Utils.Container>
      </ScrollView>
    )
  }
}
export default TokenInfo
