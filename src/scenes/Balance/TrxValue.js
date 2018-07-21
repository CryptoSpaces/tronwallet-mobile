import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Motion, spring, presets } from 'react-motion'
import { Context } from '../../store/context'

import FadeIn from '../../components/Animations/FadeIn'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

class TrxValue extends PureComponent {
  render () {
    const { trxBalance, currency } = this.props

    return (
      <React.Fragment>
        <Utils.Row justify='center' align='center'>
          <React.Fragment>
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
                        <Utils.LargeContentText>
                          {value.price.toFixed(2)}
                        </Utils.LargeContentText>
                      )}
                    </Motion>
                  </FadeIn>
                )
              }
            </Context.Consumer>
            <Badge>{currency}</Badge>
          </React.Fragment>
        </Utils.Row>
        <Utils.VerticalSpacer />
        {currency !== 'USD' && (
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
        )}
      </React.Fragment>
    )
  }
}

TrxValue.propTypes = {
  trxBalance: PropTypes.number.isRequired,
  currency: PropTypes.string.isRequired
}

export default props => (
  <Context.Consumer>
    {context => <TrxValue context={context} {...props} />}
  </Context.Consumer>
)
