import styled from 'styled-components'
import Gradient from 'react-native-linear-gradient'

export const LinearGradient = styled(Gradient)`
  align-items: center;
  justify-content: center;
  flex: 1;
`
export const ContentWrapper = styled.View`
  align-items: center;
  justify-content: center;
`
export const OuterContentWrapper = ContentWrapper.extend`
  position: relative;
`
export const Image = styled.Image`
  position: absolute;
  top: -18px;
  width: 36px;
  height: 36px;
`
export const BackgroundIllustration = styled.ImageBackground`
  position: relative;
  justify-content: center;
  align-items: center;
  width: 436px;
  height: 436px;
`
export const CenterBackGroundIllustration = BackgroundIllustration.extend`
  width: 340px;
  height: 340px;
  justify-content: center;
`
export const SpecialMessage = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  color: white;
  position: absolute;
  top: 40px;
`
