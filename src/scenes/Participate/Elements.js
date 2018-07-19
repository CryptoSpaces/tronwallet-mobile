import { Colors, FontSize } from '../../components/DesignSystem'
import { Content, Text } from '../../components/Utils'

export const Card = Content.extend`
  margin-right: 25;
  margin-left: 25;
  border-radius: 10;
  background: ${Colors.lightestBackground};
`
export const CardHeader = Text.extend`
  font-size: ${FontSize.medium};
  font-weight: 700
`
