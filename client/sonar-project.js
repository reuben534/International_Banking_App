
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: process.env.SONAR_HOST_URL,
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectName': 'banking-app-client',
      'sonar.projectKey': 'banking-app-client',
      'sonar.sources': 'src',
      'sonar.inclusions': 'src/**',
      'sonar.exclusions': 'src/reportWebVitals.js,src/setupTests.js,src/index.js,node_modules/**,build/**,public/**',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info'
    }
  },
  () => {}
);
