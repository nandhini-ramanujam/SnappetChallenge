var { DynamoDBClient, ScanCommand, BatchWriteItemCommand } = require("@aws-sdk/client-dynamodb");
var dynamoDBClient = new DynamoDBClient({ region: 'eu-west-1' });
const { unmarshall, marshall } = require("@aws-sdk/util-dynamodb");

exports.handler = async () => {
  try {
    const work_data = await scanAllItems();
    await updateStudentWorkSummary(work_data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "done" }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal server error' }),
    };
  }
};

// calculate and update summary
async function updateStudentWorkSummary(studentData: Array<DynamoDBItem>) {
  const groupId = '123';
  const groupedData = groupByDate(studentData);

  for (const date in groupedData) {
    if (groupedData.hasOwnProperty(date)) {
      const dataForDate = groupedData[date];
      const classPerformance = calculateSubjectPerformance(dataForDate);
      const domainPerformance = calculateDomainPerformance(dataForDate);
      const subjectDetails: any = {};
      const currentTime = new Date().getTime();

      // gather subject details from domain data
      Object.keys(domainPerformance).map((domain) => {
        const subject = domainPerformance[domain]?.Subject;
        const percentage = domainPerformance[domain]?.Percentage;
        if (subject) {
          if (!subjectDetails[subject]) {
            subjectDetails[subject] = [];
          }
          subjectDetails[subject].push({ Domain: domain, Percentage: percentage })
        }
      });

      // records to be added in dynamo
      let itemsToPut = [
        {
          PutRequest: {
            Item: {
              GroupId: { N: groupId },
              LastUpdatedAt: { S: currentTime.toString() },
              SubmittedDate: { S: date.toString() },
              WorkSummary: {
                M: {
                  OverallReport: { M: marshall(classPerformance) },
                  Subjects: { M: marshall(subjectDetails) }
                }
              }
            },
          },
        },
      ];

      // write to dynamo in batch
      const command = new BatchWriteItemCommand({
        RequestItems: {
          'students_work_summary': itemsToPut,
        },
      });

      try {
        const response = await dynamoDBClient.send(command);
      } catch (error) {
        console.error('Error while writing to DynamoDB:', error);
      }
    }
  }
}

// Scan with pagination
async function scanAllItems() {
  const allItems = [];
  let lastEvaluatedKey = undefined;
  do {
    const command: any = new ScanCommand({
      TableName: 'student_work_data',
      ExclusiveStartKey: lastEvaluatedKey,
    });
    const { Items, LastEvaluatedKey } = await dynamoDBClient.send(command);
    allItems.push(...Items);
    lastEvaluatedKey = LastEvaluatedKey;
  } while (lastEvaluatedKey);
  return allItems;
}

// Group records by date 
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

// calculate domain level performance
function calculateDomainPerformance(studentData: Array<DynamoDBItem>) {
  let classPerformance: any = {};
  const domains = Object.values(getDomain(studentData));

  domains.reduce((acc, data) => {
    let totalDifficulty = getDomainLevelDifficulty(studentData, data);
    const domainData = studentData.filter((exercise) => exercise.Domain === data.domain);
    let weightedPercentage = getWeightedPercentage(domainData);
    const domainPerformance = ((weightedPercentage / totalDifficulty) * 100).toFixed(2);
    classPerformance[data.domain] = { Percentage: domainPerformance, Subject: data.subject };
    return acc + domainPerformance;
  }, 0)
  return classPerformance;
}

function getDomain(studentData) {
  const records = studentData.map((exercise) => {
    return { domain: exercise.Domain, subject: exercise.Subject }
  });

  return records.reduce((acc, record) => {
    acc[record.domain] = record;
    return acc;
  }, {});
}


function getWeightedPercentage(data) {
  return data.reduce((subjectAcc, exercise) => {
    if (exercise.Difficulty != "NULL") {
      return subjectAcc + (parseFloat(exercise.Difficulty) * exercise.Correct * exercise.Progress);
    } else {
      return subjectAcc + (exercise.Correct * exercise.Progress);
    }
  }, 0);
}

function getDomainLevelDifficulty(studentData, data) {
  return studentData.reduce((acc, exercise) => {
    if (exercise.Difficulty != "NULL" && exercise.Subject === data.subject) {
      return acc + (parseFloat(exercise.Difficulty) * exercise.Correct * exercise.Progress);
    } else {
      return acc + (exercise.Correct * exercise.Progress);
    }
  }, 0);
}

function getClassTotalDifficulty(studentData) {
  return studentData.reduce((acc, exercise) => {
    if (exercise.Difficulty != "NULL") {
      return acc + (parseFloat(exercise.Difficulty));
    } else {
      return acc
    }
  }, 0);
}

function calculateSubjectPerformance(studentData: Array<DynamoDBItem>) {
  let classPerformance: any = {};
  const subjects = [...new Set(studentData.map((exercise) => exercise.Subject))];
  const totalDifficulty = getClassTotalDifficulty(studentData);
  subjects.reduce((acc, subject) => {
    const exercisesForSubject = studentData.filter((exercise) => exercise.Subject === subject);
    const weightedPercentage = getWeightedPercentage(exercisesForSubject);
    const subjectPerformance = (weightedPercentage / totalDifficulty) * 100;
    classPerformance[subject] = subjectPerformance;
    return acc + subjectPerformance;
  }, 0);
  return classPerformance;
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
