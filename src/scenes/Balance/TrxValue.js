import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Motion, spring, presets } from 'react-motion'
import { Context } from '../../store/context'
import { formatNumber } from '../../utils/numberUtils'

import FadeIn from '../../components/Animations/FadeIn'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

class TrxValue extends PureComponent {
  render () {
    const { trxBalance } = this.props

    return (
      <React.Fragment>
        <Utils.Row justify='center' align='center'>
          <Motion
            defaultStyle={{ balance: 0 }}
            style={{ balance: spring(trxBalance) }}
          >
            {value => (
              <React.Fragment>
                <Utils.Text size='large' marginX={8}>
                  {formatNumber(value.balance.toFixed(0))}
                </Utils.Text>
                <Badge guarantee>TRX</Badge>
              </React.Fragment>
            )}
          </Motion>
        </Utils.Row>
        <Utils.VerticalSpacer />
        <Context.Consumer>
          {({ price }) =>
            price.value && (
              <FadeIn name='usd-value'>
                <Motion
                  defaultStyle={{ price: 0 }}
                  style={{
                    price: spring(
                      trxBalance * price.value,
                      presets.gentle
                    )
                  }}
                >
                  {value => (
                    <Utils.Text align='center'>
                      {`${value.price.toFixed(2)} USD`}
                    </Utils.Text>
                  )}
                </Motion>
              </FadeIn>
            )
          }
        </Context.Consumer>
      </React.Fragment>
    )
  }
}

TrxValue.propTypes = {
  trxBalance: PropTypes.number.isRequired
}

export default props => (
  <Context.Consumer>
    {context => <TrxValue context={context} {...props} />}
  </Context.Consumer>
)
