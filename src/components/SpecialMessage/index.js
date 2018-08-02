import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import * as Elements from './elements'
import GradientBG from './FullScreenGradient'
import { Colors } from '../DesignSystem'

const defaultGradient = [Colors.transactionsRewardsGradient[0], Colors.transactionsRewardsGradient[1]]

const withSpecialMessage = (colorA = defaultGradient[0], colorB = defaultGradient[1]) =>
  class extends PureComponent {
    /* bgIllustration and bgCenter are being required as the whole
      require function in order to avoid the problem of the function
      not recognizing template strings or concatenation while still allowing
      users of this component to provide their own illustrations. */
    static propTypes = {
      message: PropTypes.string,
      renderMiddleContent: PropTypes.func.isRequired,
      renderBottomContent: PropTypes.func,
      bgIllustration: PropTypes.number,
      bgCenter: PropTypes.number
    }

    static defaultProps = {
      bgIllustration: require('../../assets/circle-illustration.png'),
      bgCenter: require('../../assets/bg-account.png')
    }

    render () {
      const { message, renderMiddleContent, renderBottomContent, bgIllustration, bgCenter } = this.props
      return (
        <GradientBG colorA={colorA} colorB={colorB}>
          <Elements.BackgroundIllustration
            resizeMode='contain'
            source={bgIllustration}>
            <Elements.Image source={require('../../assets/tron-logo-small.png')} />
            <Elements.SpecialMessage>
              {message}
            </Elements.SpecialMessage>
            <Elements.ContentWrapper>
              <Elements.CenterBackGroundIllustration
                resizeMode='contain'
                source={bgCenter}>
                {renderMiddleContent()}
              </Elements.CenterBackGroundIllustration>
            </Elements.ContentWrapper>
          </Elements.BackgroundIllustration>
          {renderBottomContent && renderBottomContent()}
        </GradientBG>
      )
    }
  }

export default withSpecialMessage(Colors.transactionsRewardsGradient[0], Colors.transactionsRewardsGradient[1])
export const SuccessSpecialMessage = withSpecialMessage(Colors.transactionSuccessGradient[0], Colors.transactionSuccessGradient[1])
