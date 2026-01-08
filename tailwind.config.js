/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        // 主题颜色
        primary: {
          DEFAULT: '#007AFF',
          50: '#E6F2FF',
          100: '#CCE5FF',
          200: '#99CCFF',
          300: '#66B2FF',
          400: '#3399FF',
          500: '#007AFF',
          600: '#0062CC',
          700: '#004A99',
          800: '#003166',
          900: '#001933',
        },
        secondary: {
          DEFAULT: '#5856D6',
          50: '#EFEFFB',
          100: '#DFDFF7',
          200: '#BFBFEF',
          300: '#9F9FE7',
          400: '#7F7FDF',
          500: '#5856D6',
          600: '#4645AB',
          700: '#353480',
          800: '#232256',
          900: '#12112B',
        },
        success: {
          DEFAULT: '#34C759',
          light: '#66D980',
          dark: '#2AA647',
        },
        warning: {
          DEFAULT: '#FF9500',
          light: '#FFB033',
          dark: '#CC7700',
        },
        error: {
          DEFAULT: '#FF3B30',
          light: '#FF6B63',
          dark: '#CC2F26',
        },
        info: {
          DEFAULT: '#5AC8FA',
          light: '#7ED6FB',
          dark: '#48A0C8',
        },
        // 灰度
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
    },
  },
  plugins: [],
};

