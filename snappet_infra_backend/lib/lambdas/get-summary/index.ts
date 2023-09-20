"use strict";

// lib/lambdas/get-summary/index.ts
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

const groupId = "123"; //#TODO retrieve from the event params
const targetDate = "2015-03-24"; //#TODO retrieve from the event params

exports.handler = async function () {
  try {
    const dynamoDBClient = new DynamoDBClient({});
    const command = new GetItemCommand(getParams());
    const response = await dynamoDBClient.send(command);
    const data = unmarshall(response.Item);
    return createResponse(data);
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: `Internal Server Error ${error}` }
    };
  }
};

function getParams() {
  return {
    TableName: process.env.STUDENTS_WORK_SUMMARY_TABLE,
    Key: {
      GroupId: { N: groupId },
      SubmittedDate: { S: targetDate }
    }
  };
}

function createResponse(data) {
  if (data) {
    return {
      statusCode: 200,
      body: { Summary: data.WorkSummary }
    };
  } else {
    return {
      statusCode: 404,
      body: { Message: "Data not found for the specified groupId and targetDateTime" }
    };
  }
}
