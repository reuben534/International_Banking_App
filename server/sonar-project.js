
const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: process.env.secrets.SONAR_HOST_URL,
    token: process.env.SONAR_TOKEN,
    options: {
      'sonar.projectName': 'International_Banking_App',
      'sonar.projectKey': 'reuben534',
      'sonar.sources': '.',
      'sonar.inclusions': '**',
      'sonar.exclusions': 'node_modules/**,coverage/**,.vscode/**,.github/**,dist/**,', 
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.testExecutionReportPaths': 'coverage/test-reporter.xml'
    }
  },
  () => {}
);
