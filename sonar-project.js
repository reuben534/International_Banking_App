const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner({
  serverUrl: process.env.SONAR_HOST_URL,
  token: process.env.SONAR_TOKEN,
  options: {
    'sonar.projectKey': 'reuben534',
    'sonar.projectName': 'International_Banking_App',
    'sonar.sources': 'client/src,server',
    'sonar.exclusions': '**/node_modules/**,**/*.test.js',
    'sonar.tests': 'client/src',
    'sonar.test.inclusions': '**/*.test.js,**/*.test.jsx',
    'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
    'sonar.language': 'js'
  }
}, () => {});
