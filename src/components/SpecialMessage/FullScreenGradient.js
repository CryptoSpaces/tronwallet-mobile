import React from 'react'
import { LinearGradient } from './elements'

const FullScreenGradient = ({ colorA, colorB, children }) => (
  <LinearGradient
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    colors={[colorA, colorB]}
  >
    {children}
  </LinearGradient>
)

export default FullScreenGradient
