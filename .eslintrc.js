module.exports = {
    env: {
        browser: true,
        es2021: true
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    overrides: [
        {
            env: {
                node: true
            },
            files: ['.eslintrc.{js,cjs}'],
            parserOptions: {
                sourceType: 'script'
            }
        }
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
    },
    plugins: ['react'],
    rules: {
        indent: ['error', 'tab'],
        'linebreak-style': ['error', 'unix'],
        quotes: ['error', 'single'],
        semi: ['error', 'always']
    }
};
