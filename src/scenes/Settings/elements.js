import styled, { css } from 'styled-components'
import { Colors } from '../../components/DesignSystem'

const BaseText = css`
  color: ${Colors.secondaryText};
  padding: 20px;
  align-self: center;
`
export const VersionText = styled.Text`
  font-family: Rubik-Regular;
  font-size: 12px;
  letter-spacing: 0.6;
  ${BaseText}
`
export const SectionTitle = styled.Text`
  font-family: Rubik-Medium;
  font-size: 14px;
  ${BaseText}
`
export const PayPartner = styled.Image`
  width: 120px;
  height: 50px;
  resize-mode: contain;
`
export const Getty = styled.Image`
  width: 150px;
  height: 50px;
  resize-mode: contain;
`
