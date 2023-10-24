import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'my-blue': '#3B5EE1',
        'my-yellow': '#FFD700',
        'my-orange': '#FF9900',
        'my-black': '#333333',
        'my-gray': '#C0C0C0',
        'my-light-gray': '#EFEFEF',
      },
    },
  },
  plugins: [],
};
export default config;
