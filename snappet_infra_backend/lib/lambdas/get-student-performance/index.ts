"use strict";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const groupId = "123"; //#TODO retrieve from the event params
const targetDate = "2015-03-24"; //#TODO retrieve from the event params

exports.handler = async function (env) {
  try {
    const command = new QueryCommand(getParams());
    const dynamoDBClient = new DynamoDBClient({});
    const response = await dynamoDBClient.send(command);
    const data = response?.Items?.map((item) => unmarshall(item));
    return createResponse(data);
  } catch (error) {
    return {
      statusCode: 500,
      body: { Message: "Internal Server Error" }
    };
  }
};

function getParams() {
  return {
    TableName: process.env.STUDENTS_PERFORMANCE_TABLE,
    IndexName: "GroupId-SubmittedDate-index",
    KeyConditionExpression: "GroupId = :groupId AND SubmittedDate = :date",
    ExpressionAttributeValues: {
      ":groupId": { N: groupId },
      ":date": { S: targetDate }
    }
  };
}

function createResponse(data) {
  if (data) {
    return {
      statusCode: 200,
      body: { StudentsPerformance: data }
    };
  } else {
    return {
      statusCode: 404,
      body: { Message: "Data not found for the specified groupId and targetDateTime" }
    };
  }
}
