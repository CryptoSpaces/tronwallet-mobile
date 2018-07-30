import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Motion, spring, presets } from 'react-motion'
import { Context } from '../../store/context'
import Config from 'react-native-config'
import axios from 'axios'

import FadeIn from '../../components/Animations/FadeIn'
import Badge from '../../components/Badge'
import * as Utils from '../../components/Utils'

import { formatNumber } from '../../utils/numberUtils'

class TrxValue extends PureComponent {
  state = {
    currencyPrice: null
  }

  componentDidUpdate (prevProps) {
    const { currency: currentCurrency } = this.props
    const { currency: prevCurreny } = prevProps

    if (prevCurreny !== currentCurrency) {
      this._getPrice(currentCurrency)
    }
  }

  _formatPrice = (value) => {
    const crypto = ['BTC', 'ETH']
    const { currency } = this.props
    // Im not using formatNumber directly because this is a custom formatter for balance screen
    if (Number.isInteger(value) || crypto.indexOf(currency) >= 0) {
      return formatNumber(value)
    } else {
      return value.toFixed(2)
    }
  }
  _getPrice = async (currency) => {
    try {
      const { data: { data } } = await axios.get(`${Config.TRX_PRICE_API}/?convert=${currency}`)
      this.setState({ currencyPrice: data.quotes[currency].price })
    } catch (err) {
      console.log(err)
    }
  }

  render () {
    const { trxBalance, currency } = this.props
    const { currencyPrice } = this.state

    return (
      <React.Fragment>
        <Utils.Row justify='center' align='center'>
          {currencyPrice &&
            <React.Fragment>
              <FadeIn name='usd-value'>
                <Motion
                  defaultStyle={{ price: 0 }}
                  style={{
                    price: spring(
                      trxBalance * currencyPrice,
                      presets.gentle
                    )
                  }}
                >
                  {value => (
                    <Utils.Text size='large' marginX={8}>
                      {this._formatPrice(value.price)}
                    </Utils.Text>
                  )}
                </Motion>
              </FadeIn>
              <Badge>{currency}</Badge>
            </React.Fragment>
          }
        </Utils.Row>
        <Utils.VerticalSpacer />
        {currencyPrice && currency !== 'USD' && (
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
