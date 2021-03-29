'use strict';

module.exports.createUser = async (event, context) => {
  const body = JSON.parse(event.body);
  const username = body.username;
  const password = body.password;
  const newUserParams = {
    TableName: process.env.DYNAMODB_USER_TABLE,
    Item: {
      pk: username,
      password,
    },
  };

  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const result = await dynamodb.put(newUserParams).promise();

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Headers': 'Authorization',
      },
    };
  } catch (error) {
    console.error('There was an error putting the new item');
    console.error('putError', error);
    console.error('newUserParams', newUserParams);
    return new Error('There was an error putting the new item');
  }
};
