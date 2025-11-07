const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectKey': 'InternationalBankingApp',
      'sonar.organization': 'reuben534',
      'sonar.sources': 'client/src,server',
      'sonar.tests': 'client/src',
      'sonar.test.inclusions': 'client/src/**/*.test.js,client/src/**/*.test.jsx',
      'sonar.exclusions': '**/node_modules/**,client/build/**',
      'sonar.javascript.lcov.reportPaths': 'client/coverage/lcov.info'
    }
  },
  () => {}
);
