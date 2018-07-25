import styled from 'styled-components'

export const Card = styled.View`
  flex-direction: row;
  justify-content: space-between;
`
export const Moment = styled.Text`
  font-family: Rubik-Regular;
  font-size: 10px;
  letter-spacing: 0;
  color: rgb(156, 158, 185);
`
export const Confirmation = styled.Text`
  font-family: Rubik-Medium;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: 0;
  color: white;
`
export const Badge = styled.View`
  height: 24px;
  padding-horizontal: 10px;
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
`
export const BadgeText = styled.Text`
  top: 1;
  font-family: Rubik-Medium;
  font-size: 11px;
  line-height: 11px;
  letter-spacing: 0.6px;
  color: white;
`
