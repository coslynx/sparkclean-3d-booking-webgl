module.exports = {
  content: [
    './src/**/*.tsx',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3498db',
        secondary: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
      accessibility: {
        DEFAULT: {
          focus: 'focus:outline-none focus:ring-2 focus:ring-primary',
          contrast: 'contrast-more',
        },
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('tailwindcss/nesting'),
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true,
      },
    }),
  ],
};