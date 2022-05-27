module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts', '<rootDir>/**/src/**/*.ts'],
  coverageThreshold: {
    global: {
      lines: 90,
    },
  },
  coveragePathIgnorePatterns: ['jest.config.js', '/node_modules/', '/dist/'],
  verbose: true,
}
