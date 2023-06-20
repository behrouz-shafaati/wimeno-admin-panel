import { useTranslation } from 'react-i18next';
// '@mui
import { enUS, deDE, frFR, faIR } from '@mui/material/locale';
import useSettings from './useSettings';

import { BASE_URL } from '../config';

// ----------------------------------------------------------------------

export const LANGS = [
  {
    label: 'فارسی',
    value: 'fa',
    systemValue: faIR,
    icon: `${BASE_URL}/icons/Flag-of-Iran-01-1.svg`,
    // icon: `http://localhost:3000/icons/Flag-of-Iran-01-1.svg`,
    direction: 'rtl',
  },
  {
    label: 'English',
    value: 'en',
    systemValue: enUS,
    icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_en.svg',
    direction: 'ltr',
  },
  // {
  //   label: 'German',
  //   value: 'de',
  //   systemValue: deDE,
  //   icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_de.svg',
  //   direction: 'ltr'
  // },
  // {
  //   label: 'French',
  //   value: 'fr',
  //   systemValue: frFR,
  //   icon: 'https://minimal-assets-api.vercel.app/assets/icons/ic_flag_fr.svg',
  //   direction: 'ltr'
  // },
];

export function getLangDetails(langSlug) {
  return LANGS.find((_lang) => _lang.value === langSlug) || LANGS[1];
}

export default function useLocales() {
  const { themeDirection, onChangeDirection } = useSettings();
  const { i18n, t: translate } = useTranslation();
  const langStorage = localStorage.getItem('i18nextLng');
  // const getLangDetails = (langSlug) => LANGS.find((_lang) => _lang.value === langSlug) || LANGS[1];
  const currentLang = getLangDetails(langStorage);

  const handleChangeLanguage = (newLangSlug) => {
    const newLang = getLangDetails(newLangSlug);
    onChangeDirection({ target: { value: newLang.direction } });
    i18n.changeLanguage(newLangSlug);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
    currentLang,
    allLang: LANGS,
  };
}
