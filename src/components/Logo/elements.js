import { Image } from 'react-native'
import styled from 'styled-components'
import { ZeplinSpacing, ZeplinColors } from '../DesignSystem'

export const LogoWrapper = styled(Image)`
  margin-bottom: ${ZeplinSpacing.relative.baseFive.medium}px;
`

export const LogoText = styled.Text`
  font-family: Rubik-Medium;
  font-size: 24px;
  letter-spacing: 0;
  color: ${ZeplinColors.text.primary};
`
