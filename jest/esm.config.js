import baseConfig from '../jest.config.js'

export default {
  ...baseConfig,
  moduleNameMapper: {
    '/src/loader$': '<rootDir>/lib/loader.js',
  },
  rootDir: '../',
}
