import styled from 'styled-components'
import { ZeplinColors } from '../DesignSystem'

export const Header = styled.View`
  background-color: ${ZeplinColors.background.standard};
  height: 64px;
  padding-top: 18px;
  padding-bottom: 10px;
  align-items: center;
`
export const Title = styled.Text`
  font-family: Rubik-Medium;
  font-size: 18px;
  line-height: 36px;
  letter-spacing: 0;
  color: ${ZeplinColors.text.primary};
`
