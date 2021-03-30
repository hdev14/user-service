'use strict';

const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

module.exports.login = async (event, context) => {
  const body = JSON.parse(event.body);

  const queryUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    KeyConditionExpression: '#username = :username',
    ExpressionAttributeNames: { '#username': 'pk' },
    ExpressionAttributeValues: { ':username': body.username },
  };

  try {
    const dynamodb = await AWS.DynamoDB.DocumentClient();
    const userResult = await dynamodb.query(queryUserParams).promise();

    if (!(userResult.Items !== undefined && userResult.Items.length === 1)) {
      return { statusCode: 404 };
    }

    const user = userResult.Items[0];

    const isEqual = bcrypt.compareSync(body.password, user.password);

    if (isEqual) {
      const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET);
      return {
        statusCode: 200,
        body: JSON.stringify({ token }),
      };
    }
  } catch (error) {
    console.error('There was an error attempting to retrieve the user');
    console.error('QueryError', error);
    console.error('QueryUserParams', queryUserParams);
    return new Error('There was an error attempting to retrieve the user');
  }
};
