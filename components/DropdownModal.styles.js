import { Colors, FontSize } from './DesignSystem'

export const DropdownModalStyles = {
  styles: {
    selectToggle: {
      borderBottomWidth: 1,
      borderColor: Colors.secondaryText,
      paddingTop: 10,
      paddingBottom: 5
    },
    container: {
      backgroundColor: `rgba(${Colors.RGB.darkerBackground},.9)`,
      borderWidth: 0.5,
      borderColor: Colors.secondaryText
    },
    selectToggleText: {
      textAlign: 'center',
      fontSize: FontSize.medium
    },
    item: {
      paddingTop: 15,
      paddingBottom: 15
    },
    itemText: {
      fontWeight: 'normal'
    },
    separator: {
      backgroundColor: Colors.secondaryText
    }
  },
  colors: {
    text: Colors.primaryText,
    selectToggleTextColor: Colors.primaryText
  }
}
