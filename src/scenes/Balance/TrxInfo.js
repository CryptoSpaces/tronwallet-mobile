import React, { PureComponent } from 'react'
import { Motion, spring, presets } from 'react-motion'
import { Context } from '../../store/context'

import GrowIn from '../../components/Animations/GrowIn'
import * as Utils from '../../components/Utils'

class TrxInfo extends PureComponent {
  render () {
    return (
      <Context.Consumer>
        {({ price, freeze }) =>
          price.value &&
          freeze.value && (
            <GrowIn name='tronprice'>
              <Utils.VerticalSpacer size='medium' />
              <Utils.Row justify='space-between'>
                <Utils.View align='center'>
                  <Utils.Text size='xsmall' secondary>TRON POWER</Utils.Text>
                  <Motion
                    defaultStyle={{ power: 0 }}
                    style={{
                      power: spring(freeze.value.total, presets.gentle)
                    }}
                  >
                    {value => (
                      <Utils.Text padding={4}>{`${value.power.toFixed(0)}`}</Utils.Text>
                    )}
                  </Motion>
                </Utils.View>
                <Utils.View align='center'>
                  <Utils.Text size='xsmall' secondary>TRX PRICE</Utils.Text>
                  <Motion
                    defaultStyle={{ price: 0 }}
                    style={{ price: spring(price.value, presets.gentle) }}
                  >
                    {value => (
                      <Utils.Text padding={4}>
                        {`${value.price.toFixed(this.props.pricePrecision)} USD`}
                      </Utils.Text>
                    )}
                  </Motion>
                </Utils.View>
                <Utils.View align='center'>
                  <Utils.Text size='xsmall' secondary>BANDWIDTH</Utils.Text>
                  <Motion
                    defaultStyle={{ bandwidth: 0 }}
                    style={{
                      bandwidth: spring(
                        freeze.value.bandwidth.netRemaining,
                        presets.gentle
                      )
                    }}
                  >
                    {value => (
                      <Utils.Text padding={4}>
                        {`${value.bandwidth.toFixed(0)}`}
                      </Utils.Text>
                    )}
                  </Motion>
                </Utils.View>
              </Utils.Row>
              <Utils.VerticalSpacer size='medium' />
            </GrowIn>
          )
        }
      </Context.Consumer>
    )
  }
}

TrxInfo.defaultProps = {
  pricePrecision: 4
}

export default props => (
  <Context.Consumer>
    {context => <TrxInfo context={context} {...props} />}
  </Context.Consumer>
)
