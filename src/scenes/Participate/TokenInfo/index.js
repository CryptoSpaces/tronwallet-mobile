import React, { PureComponent } from 'react'
import { ScrollView, SafeAreaView } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'

import NavigationHeader from '../../../components/Navigation/Header'
import { BoldInfoRow, RegularInfoRow, SmallRegInfoRow } from '../../../components/KeyPairInfoRow'
import { Colors } from '../../../components/DesignSystem'
import * as Utils from '../../../components/Utils'
import { ONE_TRX } from '../../../services/client'

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
    const {
      name,
      price,
      frozenPercentage,
      issuedPercentage,
      issued,
      totalSupply,
      startTime,
      endTime,
      description,
      transaction,
      ownerAddress,
      trxNum,
      num,
      block
    } = this.props.navigation.state.params.item
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: Colors.background }}>
        <ScrollView>
          <Utils.Container justify='flex-start'>
            <Utils.VerticalSpacer />
            <Utils.Column justify='center' align='center'>
              <Utils.SectionTitle>TOKEN</Utils.SectionTitle>
              <Utils.BoldText>{name}</Utils.BoldText>
            </Utils.Column>
            <Utils.VerticalSpacer size='big' />
            <BoldInfoRow pairs={[
              { key: 'PRICE PER TOKEN', value: `${price / ONE_TRX} TRX` },
              { key: 'FROZEN', value: `${frozenPercentage}%` }]}
            />
            <Utils.Content paddingVertical='small'>
              <Utils.SectionTitle>PERCENTAGE</Utils.SectionTitle>
              <Utils.Row align='center'>
                <ProgressBar
                  progress={Math.round(issuedPercentage) / 100}
                  borderWidth={0}
                  width={250}
                  height={3}
                  color={Colors.confirmed}
                  unfilledColor={Colors.lightestBackground}
                />
                <Utils.HorizontalSpacer size='medium' />
                <Utils.BoldText>{Math.round(issuedPercentage)}%</Utils.BoldText>
              </Utils.Row>
            </Utils.Content>
            <BoldInfoRow pairs={[
              { key: 'ISSUED', value: issued },
              { key: 'TOTAL SUPPLY', value: totalSupply }]}
            />
            <Utils.VerticalSpacer size='xsmall' />
            <SmallRegInfoRow pairs={[
              { key: 'START TIME', value: moment(startTime).format('DD/MM/YYYY hh:mm A') },
              { key: 'END TIME', value: moment(endTime).format('DD/MM/YYYY hh:mm A') }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: 'DESCRIPTION', value: description }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: 'TRANSACTION', value: transaction }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: 'OWNER ADDRESS', value: ownerAddress }]}
            />
            <Utils.VerticalSpacer size='small' />
            <BoldInfoRow pairs={[
              { key: 'TRXNUM', value: trxNum },
              { key: 'NUM', value: num },
              { key: 'BLOCK', value: block }]}
            />
          </Utils.Container>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default TokenInfo
