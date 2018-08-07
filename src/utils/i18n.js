import I18n from 'react-native-i18n'
import translations from './translations'

I18n.missingTranslation = (obj) => `Missing this translation ${obj}`
I18n.defaultLocale = 'en-US'
I18n.fallbacks = true
I18n.translations = translations

export default I18n
