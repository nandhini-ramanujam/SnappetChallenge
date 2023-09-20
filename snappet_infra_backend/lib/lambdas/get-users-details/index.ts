"use strict";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const groupId = "123"; //#TODO retrieve from the event params

exports.handler = async function () {
  try {
    const dynamoDBClient = new DynamoDBClient({});
    const command = new QueryCommand(getParams());
    const response = await dynamoDBClient.send(command);
    const data = response?.Items?.map((item) => unmarshall(item));

    return createResponse(data);
  } catch (error) {
    console.error("Error:", error);
    return {
      statusCode: 500,
      body: { message: "Internal Server Error" }
    };
  }
};

function getParams() {
  return {
    TableName: process.env.USERS_TABLE,
    IndexName: "GroupId-index",
    KeyConditionExpression: "GroupId = :groupId",
    ExpressionAttributeValues: {
      ":groupId": { N: groupId }
    }
  };
}

function createResponse(data) {
  if (data) {
    return {
      statusCode: 200,
      body: { Students: data }
    };
  } else {
    return {
      statusCode: 404,
      body: { message: "Data not found for the specified groupId" }
    };
  }
}
