const { DynamoDBClient, ScanCommand, BatchWriteItemCommand, QueryCommand } = require("@aws-sdk/client-dynamodb");
const dynamoDBClient = new DynamoDBClient({ region: 'eu-west-1' });
import { unmarshall, marshall } from "@aws-sdk/util-dynamodb";

const WIGHET_DIFFICULTY = 0.4;
const WIGHET_CORRECT = 0.4;
const WIGHET_PROGRESS = 0.2;
const MAX_PROGRESS = 10; // Assuming the max progress value is 10
const MAX_DIFFICULTY = 400; // TODO - should be differ per student based on their level in each subject

exports.handler = async () => {
  try {
    await updatePerformance();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "done" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: { message: "Internal Server Error" }
    };
  }
};

// get and update student performance summary
async function updatePerformance() {
  const userRecords = await scanUserRecords();
  for (const user of userRecords) {
    const userIdentifier = unmarshall(user).UserId;
    if (userIdentifier != null) {
      const workDetails = await queryStudentWorkRecords(user.UserId);
      await update(workDetails, userIdentifier);
    }
  }
}

function getParams(userId: number) {
  return {
    TableName: 'student_work_data',
    KeyConditionExpression: 'UserId = :UserId',
    ExpressionAttributeValues: {
      ':UserId': userId,
    }
  };
}

// Query dynamo with pagination
async function queryStudentWorkRecords(userId: number) {
  try {
    const allItems = [];
    let lastEvaluatedKey = undefined;
    do {
      const command: any = new QueryCommand({
        ...getParams(userId),
        ExclusiveStartKey: lastEvaluatedKey,
      });
      const { Items, LastEvaluatedKey } = await dynamoDBClient.send(command);
      allItems.push(...Items);
      lastEvaluatedKey = LastEvaluatedKey;
    } while (lastEvaluatedKey);
    return allItems;
  } catch (error) {
    console.error("Error querying items with pagination:", error);
    throw error;
  }
}

// update dynamo with calculated details
async function update(wordRecords: Array<DynamoDBItem>, userId: string) {
  const groupedData = groupByDate(wordRecords);
  const currentTime = new Date().getTime();
  for (const date in groupedData) {
    if (groupedData.hasOwnProperty(date)) {
      const dataByDate = groupedData[date];
      const studentPerformance = calculateStudentPerformance(dataByDate);
      const userIdentifier = userId.toString();
      if (userIdentifier && userIdentifier != null) {
        let itemsToPut = [
          {
            PutRequest: {
              Item: {
                UserId: { N: userIdentifier },
                GroupId: { N: '123' },
                LastUpdatedAt: { S: currentTime.toString() },
                SubmittedDate: { S: date.toString() },
                Performance: {
                  M: marshall(studentPerformance)
                }
              },
            },
          },
        ];
        const command = new BatchWriteItemCommand({
          RequestItems: {
            'students_performance': itemsToPut,
          },
        });
        try {
          await dynamoDBClient.send(command);
        } catch (error) {
          throw new Error(`Error while writing to DynamoDB ${error}`);
        }
      }
    }
  }
}

// Scan all user records
async function scanUserRecords() {
  const allItems = [];
  let lastEvaluatedKey = undefined;
  do {
    const command: any = new ScanCommand({
      TableName: 'students',
      ExclusiveStartKey: lastEvaluatedKey,
    });
    const { Items, LastEvaluatedKey } = await dynamoDBClient.send(command);
    allItems.push(...Items);
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);

  return allItems;
}

// group records by date
function groupByDate(studentData: Array<DynamoDBItem>) {
  const groupedData: any = {};
  studentData.forEach((item) => {
    item = unmarshall(item)
    const date = item.SubmitDateTime.split('T')[0];
    if (!groupedData[date]) {
      groupedData[date] = [];
    }
    groupedData[date].push(item);
  });
  return groupedData;
}

// calculated students performance on a specific date
function calculateStudentPerformance(studentData) {
  const subjects = [...new Set(studentData.map((exercise) => exercise.Subject))];
  let performance = {};
  let totalPossibleScore = getMaxPossibleScore();

  subjects.map((subject) => {
    const exercisesForSubject = studentData.filter((exercise) => exercise.Subject === subject);
    const score = exercisesForSubject.reduce((acc, data) => {
      const studentPerformance = performancePerSubject(data);
      return acc + studentPerformance;
    }, 0);
    performance[subject] = (score / totalPossibleScore)?.toFixed(2)
  });
  return performance;
}

// find max possible score
function getMaxPossibleScore() {
  return (
    WIGHET_DIFFICULTY * MAX_DIFFICULTY + WIGHET_CORRECT + WIGHET_PROGRESS * MAX_PROGRESS
  );
}

// calculate performance on each subject
function performancePerSubject(data) {
  const difficulty = parseFloat(data.Difficulty) || 0;
  const correct = data.Correct || 0;
  const progress = data.Progress || 0;
  const performance =
    WIGHET_DIFFICULTY * difficulty +
    WIGHET_CORRECT * correct +
    WIGHET_PROGRESS * progress;
  return performance;
}

interface DynamoDBItem {
  SubmittedAnswerId: number;
  SubmitDateTime: string;
  Correct: number;
  Progress: number;
  UserId: number;
  ExerciseId: number;
  Difficulty: string;
  Subject: string;
  Domain: string;
  LearningObjective: string;
}