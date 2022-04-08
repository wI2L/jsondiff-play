const plugin = require('tailwindcss/plugin')

module.exports = {
    mode: ['jit'],
    content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                lato: ['Lato', 'sans-serif'],
            },
        },
    },
    plugins: [
        plugin(function ({ addUtilities, matchUtilities, theme }) {
            const scrollbarTrackColorValue = (value) => ({
                '--scrollbar-track': value,
                '&::-webkit-scrollbar-track': {
                    'background-color': value,
                },
            })

            const scrollbarTrackRoundedValue = (value) => ({
                '&::-webkit-scrollbar-track': {
                    'border-radius': value,
                },
            })

            const scrollbarThumbColorValue = (value) => ({
                '--scrollbar-thumb': value,
                '&::-webkit-scrollbar-thumb': {
                    'background-color': value,
                },
            })

            const scrollbarThumbRoundedValue = (value) => ({
                '&::-webkit-scrollbar-thumb': {
                    'border-radius': value,
                },
            })

            addUtilities({
                '.scrollbar': {
                    '--scrollbar-thumb': '#cdcdcd',
                    '--scrollbar-track': '#f0f0f0',
                    '--scrollbar-width': '17px',
                    'scrollbar-color': 'var(--scrollbar-thumb) var(--scrollbar-track)',
                    '&::-webkit-scrollbar': {
                        width: 'var(--scrollbar-width)',
                    },
                },
                '.scrollbar-thin': {
                    '--scrollbar-width': '8px',
                    'scrollbar-width': 'thin',
                },
            })

            Object.entries(theme('colors')).forEach(([colorName, color]) => {
                switch (typeof color) {
                    case 'object':
                        matchUtilities(
                          {
                              [`scrollbar-track-${colorName}`]: (value) => scrollbarTrackColorValue(value),
                              [`scrollbar-thumb-${colorName}`]: (value) => scrollbarThumbColorValue(value),
                          },
                          {
                              values: color,
                          }
                        )
                        break
                    case 'function':
                        addUtilities({
                            [`.scrollbar-track-${colorName}`]: scrollbarTrackColorValue(color({})),
                            [`.scrollbar-thumb-${colorName}`]: scrollbarThumbColorValue(color({})),
                        })
                        break
                    case 'string':
                        addUtilities({
                            [`.scrollbar-track-${colorName}`]: scrollbarTrackColorValue(color),
                            [`.scrollbar-thumb-${colorName}`]: scrollbarThumbColorValue(color),
                        })
                        break
                }
            })

            matchUtilities(
              {
                  'scrollbar-track-rounded': (value) => scrollbarTrackRoundedValue(value),
                  'scrollbar-thumb-rounded': (value) => scrollbarThumbRoundedValue(value),
              },
              {
                  values: theme('borderRadius'),
              }
            )
        }),
    ],
}
