/**
 * 国际化配置
 * 基于 i18next 的多语言支持
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { cacheStorage } from '../storage/cache-storage';
import { STORAGE_KEYS } from '../storage/storage-keys';
import { logger } from '../logger';

// 导入语言包
import zhCN from '../../../locales/zh-CN.json';
import enUS from '../../../locales/en-US.json';

/**
 * 支持的语言列表
 */
export const SUPPORTED_LANGUAGES = {
  'zh-CN': { name: '简体中文', nativeName: '简体中文' },
  'en-US': { name: 'English', nativeName: 'English' },
} as const;

export type SupportedLanguage = keyof typeof SUPPORTED_LANGUAGES;

/**
 * 默认语言
 */
const DEFAULT_LANGUAGE: SupportedLanguage = 'zh-CN';

/**
 * 获取设备语言
 */
const getDeviceLanguage = (): SupportedLanguage => {
  try {
    const locales = getLocales();
    const deviceLocale = locales[0]?.languageTag;
    
    if (deviceLocale) {
      // 尝试精确匹配
      if (deviceLocale in SUPPORTED_LANGUAGES) {
        return deviceLocale as SupportedLanguage;
      }
      
      // 尝试匹配语言代码（忽略地区）
      const languageCode = deviceLocale.split('-')[0];
      const matchedLanguage = Object.keys(SUPPORTED_LANGUAGES).find(lang =>
        lang.startsWith(languageCode)
      );
      
      if (matchedLanguage) {
        return matchedLanguage as SupportedLanguage;
      }
    }
  } catch (error) {
    logger.error('Failed to get device language', error, 'i18n');
  }
  
  return DEFAULT_LANGUAGE;
};

/**
 * 获取保存的语言设置
 */
const getSavedLanguage = async (): Promise<SupportedLanguage> => {
  try {
    const saved = await cacheStorage.getItem(STORAGE_KEYS.LANGUAGE);
    if (saved && saved in SUPPORTED_LANGUAGES) {
      return saved as SupportedLanguage;
    }
  } catch (error) {
    logger.error('Failed to get saved language', error, 'i18n');
  }
  
  return getDeviceLanguage();
};

/**
 * 保存语言设置
 */
export const saveLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    await cacheStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    logger.info(`Language saved: ${language}`, undefined, 'i18n');
  } catch (error) {
    logger.error('Failed to save language', error, 'i18n');
  }
};

/**
 * 初始化 i18next
 */
export const initI18n = async (): Promise<void> => {
  try {
    const savedLanguage = await getSavedLanguage();
    
    await i18n
      .use(initReactI18next)
      .init({
        compatibilityJSON: 'v3', // 兼容 JSON 格式
        resources: {
          'zh-CN': { translation: zhCN },
          'en-US': { translation: enUS },
        },
        lng: savedLanguage,
        fallbackLng: DEFAULT_LANGUAGE,
        interpolation: {
          escapeValue: false, // React 已经处理了 XSS
        },
        react: {
          useSuspense: false, // 禁用 Suspense，避免在 React Native 中出现问题
        },
      });
    
    logger.info(`i18n initialized with language: ${savedLanguage}`, undefined, 'i18n');
  } catch (error) {
    logger.error('Failed to initialize i18n', error, 'i18n');
    throw error;
  }
};

/**
 * 切换语言
 */
export const changeLanguage = async (language: SupportedLanguage): Promise<void> => {
  try {
    await i18n.changeLanguage(language);
    await saveLanguage(language);
    logger.info(`Language changed to: ${language}`, undefined, 'i18n');
  } catch (error) {
    logger.error('Failed to change language', error, 'i18n');
    throw error;
  }
};

/**
 * 获取当前语言
 */
export const getCurrentLanguage = (): SupportedLanguage => {
  return (i18n.language as SupportedLanguage) || DEFAULT_LANGUAGE;
};

/**
 * 导出 i18n 实例
 */
export { i18n };

