'use strict';

// tests for authorizer
// Generated by serverless-mocha-plugin

const mochaPlugin = require('serverless-mocha');
const expect = mochaPlugin.chai.expect;
let wrapped = mochaPlugin.getWrapper('authorizer', '../../../src/functions/authorizer.js', 'authorizer');

const AWS_MOCK = require('aws-sdk-mock');
const AWS_SDK = require('aws-sdk');
AWS_MOCK.setSDKInstance(AWS_SDK);

describe('authorizer', () => {
  before((done) => {
    done();
  });

  it('implement tests here', async () => {
    const response = await wrapped.run({});
    expect(response).to.not.be.empty;
  });
});
