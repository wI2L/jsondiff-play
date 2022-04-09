module.exports = {
    rules: {
        'indentation': [
            4,
            {
                'baseIndentLevel': 1
            }
        ],
        'color-hex-case': 'upper'
    },
    plugins: [
        'stylelint-scss',
        'stylelint-order'
    ],
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue'
    ],
};
