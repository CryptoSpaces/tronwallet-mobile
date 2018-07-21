import styled from 'styled-components'

import { ZeplinColors } from '../DesignSystem'
import * as Utils from '../../components/Utils'

export const Row = Utils.Row.extend`
  align-items: center;
`

export const Wrapper = styled.View`
  shadow-offset: 0 5px;
  shadow-radius: 10px;
  shadow-color: #000000;
  shadow-opacity: 0.1;
  justify-content: center;
  position: relative;
`
export const LargeWrapper = Wrapper.extend`
  height: 36px;
  border-radius: 4px;
`
export const MediumWrapper = Wrapper.extend`
  paddingHorizontal: 9px;
  background-color: ${ZeplinColors.badges.standard};
  height: 28px;
  border-radius: 2px;
`
export const SmallWrapper = Wrapper.extend`
  height: 24px;
  border-radius: 2px;
  opacity: 0.97;
`
export const XSmallWrapper = Wrapper.extend`
  height: 22px;
  border-radius: 5px;
`

export const Text = styled.Text`
  top: 1;
  font-family: Rubik-Medium;
  font-size: 14px;
  line-height: 14px;
  letter-spacing: 0;
  color: ${ZeplinColors.text.primary};
`
export const Guarantee = styled.View`
  z-index: 999;
  left: -3;
  elevation: 1;
`
export const Image = styled.Image`
  width: 15px;
  height: 15px;
`
