exports.config = {
  framework: 'jasmine',
  seleniumAddress: 'http://localhost:4444/wd/hub',
  baseUrl: 'http://localhost:3000',
  suites: {
    all: [
      './*.spec.js', // load your e2e test files here
    ]
  },
  suite: 'all',
  capabilities: {
    browserName: 'chrome'
  },
  onPrepare: function onPrepare() {
    require('babel-core/register');
    var SpecReporter = require('jasmine-spec-reporter');
    jasmine.getEnv().addReporter(new SpecReporter({
      displayStacktrace: 'none',
      prefixes: {
        success: '+ ',
        failure: 'x ',
        pending: '* '
      }
    }));
    browser.manage().window().setSize(1280, 1024);
    console.log('We are going to use the following baseUrl during the tests:', browser.baseUrl); // eslint-disable-line no-console
  }
};
