import * as cdk from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { Stack, StackProps } from 'aws-cdk-lib';
import { createUserDetailsLambda } from './infrastructure/lambdas/get-users-details';
import { createPerformanceDetailsLambda } from './infrastructure/lambdas/get-student-performance';
import { createPerformanceSummaryLambda } from './infrastructure/lambdas/get-summary';
import { createSeedSummaryLambda } from './infrastructure/lambdas/seed-work-summary';
import { createStudentPerformanceSeedLambda } from './infrastructure/lambdas/seed-performance-summary';
import { environment } from './infrastructure/environments/env.dev';

export class SnappetInfraStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // Dynamo
    const workSummaryTable = dynamodb.Table.fromTableName(this, 'students_work_summary', 'students_work_summary');
    const studentWorkDataTable = dynamodb.Table.fromTableName(this, 'student_work_data', 'student_work_data');
    const studentsTable = dynamodb.Table.fromTableName(this, 'students', 'students');
    const studentPerformanceTable = dynamodb.Table.fromTableName(this, 'students_performance', 'students_performance');
    const usersTable = dynamodb.Table.fromTableName(this, 'users', 'users');

    // Lambda
    const performanceGetLambdaFn = createPerformanceDetailsLambda(this, 'GetStudentPerformanceLambda', environment);
    const performanceSummaryGetLambdaFn = createPerformanceSummaryLambda(this, 'GetSummaryLambda', environment);
    const seedSummaryLambdaFn = createSeedSummaryLambda(this, 'SeedSummaryLambda');
    const userDetailsGetLambdaFn = createUserDetailsLambda(this, 'GetUserDetailsLambda', environment);
    const seedPerformanceLambdaFn = createStudentPerformanceSeedLambda(this, 'SeedPerformanceLambda');

    // Grant Lambda permissions to access DynamoDB
    workSummaryTable.grantReadWriteData(seedSummaryLambdaFn);
    studentWorkDataTable.grantReadWriteData(seedSummaryLambdaFn);
    studentPerformanceTable.grantReadWriteData(seedPerformanceLambdaFn);
    studentsTable.grantReadData(seedPerformanceLambdaFn);
    studentWorkDataTable.grantReadData(seedPerformanceLambdaFn);
    workSummaryTable.grantReadWriteData(performanceSummaryGetLambdaFn);
    studentPerformanceTable.grantReadData(performanceGetLambdaFn);
    workSummaryTable.grantReadWriteData(performanceSummaryGetLambdaFn);
    usersTable.grantReadData(userDetailsGetLambdaFn);
  }

}
const app = new cdk.App();
new SnappetInfraStack(app, 'MyCdkStack');

