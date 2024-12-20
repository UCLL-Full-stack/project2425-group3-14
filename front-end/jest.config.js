
module.exports = {
  testEnvironment: 'jsdom',
  transform: {
  '\\.[jt]sx?$': 'esbuild-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '\\.module\\.css$': 'jest-transform-stub',
  },
  }