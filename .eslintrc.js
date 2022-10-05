module.exports = {
  env: {
    browser: true,
    es2021: true,
  },



  overrides: [],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },

  plugins: ['react', '@typescript-eslint'],
  rules: [{         
    
    "prettier/prettier": [
    "error",
    {
      "endOfLine": "auto"
    },
  ]
}]

  

 
};
