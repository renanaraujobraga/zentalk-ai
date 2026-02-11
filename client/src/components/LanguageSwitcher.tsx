import { useTranslation } from '@/hooks/useTranslation'
import { Globe } from 'lucide-react'

/**
 * Componente para alternar idiomas
 */
export function LanguageSwitcher() {
  const { language, setLanguage, getAvailableLanguages } = useTranslation()
  const languages = getAvailableLanguages()

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as any)}
        className="px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  )
}
