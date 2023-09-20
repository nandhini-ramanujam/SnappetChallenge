import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import { Construct } from 'constructs';

export function createStudentPerformanceSeedLambda(scope: Construct, id: string): lambda.Function {

  const studentPerformanceCodePath = path.join(__dirname, '../.././lambdas/seed-performance-summary');
  const lambdaFunction = new NodejsFunction(scope, 'SeedPerformanceLambda', {
    entry: `${studentPerformanceCodePath}/index.ts`,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler'
  });

  return lambdaFunction;
}
