module.exports = {
  coverageDirectory: 'reports/jest',
  coverageThreshold: {
    global: {
      branches: 90,
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
