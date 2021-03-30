'use strict';

const jwt = require('jsonwebtoken');

const generatePolicy = (principalId, effect, resource) => {
  let authResponse = {};
  
  authResponse.principalId = principalId;
  if (effect && resource) {
      let policyDocument = {};
      policyDocument.Version = '2012-10-17'; 
      policyDocument.Statement = [];
      let statementOne = {};
      statementOne.Action = 'execute-api:Invoke'; 
      statementOne.Effect = effect;
      statementOne.Resource = resource;
      policyDocument.Statement[0] = statementOne;
      authResponse.policyDocument = policyDocument;
  }
  
  // Optional output with custom properties of the String, Number or Boolean type.
  // authResponse.context = {
  //     "stringKey": "stringval",
  //     "numberKey": 123,
  //     "booleanKey": true
  // };
  return authResponse;
};

module.exports.authorizer = async (event, context) => {
  const [type, token] = event.ahtorizationToken.split(' ');

  if (type !== 'Bearer' || !token) {
    return generatePolicy(undefined, 'Deny', event.methodArn);
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (typeof decoded.username === 'undefined') {
    return generatePolicy(undefined, 'Deny', event.methodArn);
  }

  return generatePolicy(decoded.username, 'Allow', event.methodArn);
};
