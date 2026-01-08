/**
 * 翻译 Hook 封装
 * 提供便捷的翻译方法
 */

import { useTranslation as useI18nTranslation } from 'react-i18next';
import { changeLanguage, getCurrentLanguage, type SupportedLanguage } from './i18n';

/**
 * 翻译 Hook
 * 封装 react-i18next 的 useTranslation
 */
export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();

  return {
    /** 翻译函数 */
    t,
    /** 当前语言 */
    language: getCurrentLanguage(),
    /** 切换语言 */
    changeLanguage: (lang: SupportedLanguage) => changeLanguage(lang),
    /** i18n 实例 */
    i18n,
  };
};

/**
 * 格式化日期（根据当前语言）
 */
export const useFormatDate = () => {
  const { language } = useTranslation();

  return (date: Date | string | number, format: 'short' | 'long' = 'short'): string => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    
    const locale = language === 'zh-CN' ? 'zh-CN' : 'en-US';
    
    const options: Intl.DateTimeFormatOptions = format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
      : { year: 'numeric', month: '2-digit', day: '2-digit' };
    
    return new Intl.DateTimeFormat(locale, options).format(dateObj);
  };
};

/**
 * 格式化数字（根据当前语言）
 */
export const useFormatNumber = () => {
  const { language } = useTranslation();

  return (value: number, options?: Intl.NumberFormatOptions): string => {
    const locale = language === 'zh-CN' ? 'zh-CN' : 'en-US';
    return new Intl.NumberFormat(locale, options).format(value);
  };
};

/**
 * 格式化货币（根据当前语言）
 */
export const useFormatCurrency = () => {
  const { language } = useTranslation();

  return (value: number, currency: string = 'CNY'): string => {
    const locale = language === 'zh-CN' ? 'zh-CN' : 'en-US';
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  };
};

