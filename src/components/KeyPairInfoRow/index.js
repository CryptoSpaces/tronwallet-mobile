import React from 'react'

import * as Utils from '../Utils'

export const KeyPairInfoRow = ({Text, pairs}) => (
  <Utils.Content paddingVertical='small'>
    <Utils.Row>
      {pairs.map(pair => (
        <Utils.View key={pair.key} style={{flex: 1}}>
          <Utils.SectionTitle>{pair.key}</Utils.SectionTitle>
          <Text>{pair.value}</Text>
        </Utils.View>
      ))}
    </Utils.Row>
  </Utils.Content>
)

export const BoldInfoRow = ({pairs}) => <KeyPairInfoRow Text={Utils.BoldText} pairs={pairs} />
export const RegularInfoRow = ({pairs}) => <KeyPairInfoRow Text={Utils.RegularText} pairs={pairs} />
export const SmallRegInfoRow = ({pairs}) => <KeyPairInfoRow Text={Utils.SmallRegText} pairs={pairs} />
