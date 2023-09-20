import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import { Construct } from 'constructs';

export function createSeedSummaryLambda(scope: Construct, id: string): lambda.Function {

  const lambdaPath = path.join(__dirname, '../.././lambdas/seed-work-summary');
  const lambdaFn = new NodejsFunction(scope, 'SeedSummaryLambda', {
    entry: `${lambdaPath}/index.ts`,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler'
  });

  return lambdaFn;
}
