import { AsyncStorage } from 'react-native'
import I18n from 'react-native-i18n'

import { USER_PREFERRED_LANGUAGE } from '../utils/constants'
import translations from './translations'

AsyncStorage.getItem(USER_PREFERRED_LANGUAGE).then(userLocale => {
  if (userLocale) {
    I18n.locale = userLocale
  }
})
I18n.missingTranslation = (obj) => `Missing this translation ${obj}`
I18n.defaultLocale = 'en-US'
I18n.fallbacks = true
I18n.translations = translations

export default I18n
