import { useState, useEffect } from 'react'
import { i18n, type Language } from '../lib/i18n'

/**
 * Hook para usar traduções no componente
 */
export function useTranslation() {
  const [language, setLanguageState] = useState<Language>(i18n.getLanguage())

  const setLanguage = (lang: Language) => {
    i18n.setLanguage(lang)
    setLanguageState(lang)
  }

  const t = (key: string, defaultValue?: string) => {
    return i18n.t(key, defaultValue)
  }

  const getAvailableLanguages = () => {
    return i18n.getAvailableLanguages()
  }

  return {
    language,
    setLanguage,
    t,
    getAvailableLanguages,
  }
}
