import React from 'react'

import * as Elements from './elements'

const BadgeBase = ({ Wrapper, guarantee, children }) => (
  <Elements.Row>
    <Wrapper>
      <Elements.Text>{children}</Elements.Text>
    </Wrapper>
    {guarantee && (
      <Elements.Guarantee>
        <Elements.Image source={require('../../assets/guarantee.png')} />
      </Elements.Guarantee>
    )}
  </Elements.Row>
)

const withWrapper = (Wrapper) => (props) => (
  <BadgeBase Wrapper={Wrapper} {...props} />
)

export const LBadge = withWrapper(Elements.LargeWrapper)
export const Badge = withWrapper(Elements.MediumWrapper)
export const SBadge = withWrapper(Elements.SmallWrapper)
export const XSBadge = withWrapper(Elements.XSmallWrapper)

export default Badge
