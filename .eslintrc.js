/* eslint-disable linebreak-style */
module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
    'node': true
  },
  'extends': [
    'eslint:recommended',
    'plugin:react/recommended'
  ],
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 12,
    'sourceType': 'module'
  },
  'plugins': [
    'react'
  ],
  'parser': 'babel-eslint',
  'rules': {
    'indent': [  // 缩进为2个空格
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'windows'
    ],
    'quotes': [ // 字符串用单引号
      'error',
      'single'
    ],
    'semi': [ // 句尾加分号
      'error',
      'always'
    ],
    'no-multiple-empty-lines': [2, { // 空行最多不能超过1行
      'max': 1
    }],
  }
};
