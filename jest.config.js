module.exports = {
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageDirectory: 'reports/jest',
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 90,
      lines: 90,
      statements: -10
    }
  },
  preset: 'ts-jest',
  reporters: [
    'default',
    ['jest-junit', {
      outputDirectory: 'reports/jest',
      outputName: 'results.xml'
    }]
  ],
  testEnvironment: 'node'
}
