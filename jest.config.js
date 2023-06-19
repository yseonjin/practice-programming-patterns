module.exports = {
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
  testEnvironment: 'node',
  moduleFileExtensions: ['js', 'json', 'ts'],
  testRegex: '\\.(test)\\.ts$',
  globals: {
    'ts-jest': {
      diagnostics: true,
      isolatedModules: true,
    },
  },
};
