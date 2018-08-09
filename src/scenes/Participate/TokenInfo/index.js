import React, { PureComponent } from 'react'
import { ScrollView, SafeAreaView } from 'react-native'
import ProgressBar from 'react-native-progress/Bar'
import moment from 'moment'

import tl from '../../../utils/i18n'
import NavigationHeader from '../../../components/Navigation/Header'
import { BoldInfoRow, RegularInfoRow, SmallRegInfoRow } from '../../../components/KeyPairInfoRow'
import { Colors } from '../../../components/DesignSystem'
import * as Utils from '../../../components/Utils'
import { ONE_TRX } from '../../../services/client'

class TokenInfo extends PureComponent {
  static navigationOptions = ({ navigation }) => ({
    header: (
      <NavigationHeader
        title={tl.t('participate.tokenInfo')}
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
              <Utils.SectionTitle>{tl.t('participate.token')}</Utils.SectionTitle>
              <Utils.BoldText>{name}</Utils.BoldText>
            </Utils.Column>
            <Utils.VerticalSpacer size='big' />
            <BoldInfoRow pairs={[
              { key: tl.t('participate.pricePerToken'), value: `${price / ONE_TRX} TRX` },
              { key: tl.t('participate.frozen'), value: `${frozenPercentage}%` }]}
            />
            <Utils.Content paddingVertical='small'>
              <Utils.SectionTitle>{tl.t('participate.percentage')}</Utils.SectionTitle>
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
              { key: tl.t('participate.issued'), value: issued },
              { key: tl.t('participate.totalSupply'), value: totalSupply }]}
            />
            <Utils.VerticalSpacer size='xsmall' />
            <SmallRegInfoRow pairs={[
              { key: tl.t('participate.startTime'), value: moment(startTime).format('DD/MM/YYYY hh:mm A') },
              { key: tl.t('participate.endTime'), value: moment(endTime).format('DD/MM/YYYY hh:mm A') }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: tl.t('participate.description'), value: description }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: tl.t('participate.transaction'), value: transaction }]}
            />
            <Utils.VerticalSpacer size='small' />
            <RegularInfoRow pairs={[
              { key: tl.t('participate.ownerAddress'), value: ownerAddress }]}
            />
            <Utils.VerticalSpacer size='small' />
            <BoldInfoRow pairs={[
              { key: tl.t('participate.trxNum'), value: trxNum },
              { key: tl.t('participate.num'), value: num },
              { key: tl.t('participate.block'), value: block }]}
            />
          </Utils.Container>
        </ScrollView>
      </SafeAreaView>
    )
  }
}
export default TokenInfo
