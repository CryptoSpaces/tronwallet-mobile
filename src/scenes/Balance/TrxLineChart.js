import React from 'react'
import PropTypes from 'prop-types'
import { LineChart } from 'react-native-svg-charts'
import Gradient from '../../components/Gradient'

import GrowIn from '../../components/Animations/GrowIn'

const TrxLineChart = ({height, chartHistory}) => (
  <GrowIn name='linechart' height={height}>
    <LineChart
      style={{ height }}
      data={chartHistory}
      svg={{ stroke: 'url(#gradient)', strokeWidth: 3 }}
      animate
    >
      <Gradient />
    </LineChart>
  </GrowIn>
)

TrxLineChart.defaultProps = {
  height: 40
}

TrxLineChart.propTypes = {
  height: PropTypes.number,
  chartHistory: PropTypes.array.isRequired
}

export default TrxLineChart
