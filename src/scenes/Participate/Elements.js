import { Colors, FontSize } from '../../components/DesignSystem'
import { Text, View } from '../../components/Utils'

export const Card = View.extend`
  margin-right: 25;
  margin-left: 25;
  border-radius: 10;
  background: ${Colors.lightestBackground};
  overflow: hidden;
`
export const CardHeader = Text.extend`
  font-size: ${FontSize.medium};
  font-weight: 700;
`

export const Featured = View.extend`
  width: 30%;
  margin: 0 auto;
  background: ${Colors.unconfirmed};
  border-bottom-left-radius: 5;
  border-bottom-right-radius: 5;
`
