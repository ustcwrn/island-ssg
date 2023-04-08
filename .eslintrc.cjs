module.exports = {
    extends :[
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'plugin:prettier/recommended'
    ],
    parser:'@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    // eslint-plugin-react
    plugins: ['react', '@typescript-eslint', 'react-hooks', 'prettier'],
    rules: {
        'prettier/prettier': 'error',
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        // 关闭导入react的规则
        'react/react-in-jsx-scope' : 'off',
        'react/no-unknown-property': 'off'
    },
    settings: {
        react: {
            // react自动探测版本号
            version: 'detect' 
        }
    }
}