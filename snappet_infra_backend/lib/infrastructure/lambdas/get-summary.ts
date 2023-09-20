import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CreateApiGatewayAuthorizer } from './authorizer';

export function createPerformanceSummaryLambda(scope: Construct, id: string, env: any): lambda.Function {

  const { STUDENTS_WORK_SUMMARY_TABLE } = env;

  // Create Lambda Function
  const performanceSummaryGetLambdaFn = new NodejsFunction(scope, 'GetSummaryLambda', {
    entry: `${path.join(__dirname, '../.././lambdas/get-summary')}/index.ts`,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    environment: {
      STUDENTS_WORK_SUMMARY_TABLE
    }
  });

  // Create API Gateway
  const api = new apigateway.RestApi(scope, 'get-summary', {
    deploy: true
  });

  // Authorizer
  const authorizer = CreateApiGatewayAuthorizer(scope, 'get-summary', api.restApiId)

  // Create a Lambda integration with API Gateway
  const lambdaIntegration = new apigateway.LambdaIntegration(performanceSummaryGetLambdaFn, {
    integrationResponses: [
      {
        responseParameters: {
          'method.response.header.Access-Control-Allow-Origin': "'*'"
        },
        statusCode: '200',
      },
    ],
    passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
    proxy: false,
    requestTemplates: {
      'application/json': JSON.stringify({})
    },
  });

  // Api resource
  const resource = api.root.addResource('summary', {
    defaultCorsPreflightOptions: {
      statusCode: 200,
      allowOrigins: ["*"],
      allowMethods: ['OPTIONS', 'GET'],
    }
  });

  // Api method
  resource.addMethod('GET', lambdaIntegration, {
    authorizer: {
      authorizationType: apigateway.AuthorizationType.COGNITO,
      authorizerId: authorizer.ref,
    },
    methodResponses: [
      {
        statusCode: '200',
        responseParameters: {
          "method.response.header.Access-Control-Allow-Headers": true,
          "method.response.header.Access-Control-Allow-Methods": true,
          "method.response.header.Access-Control-Allow-Origin": true
        },
      },
    ]
  });

  performanceSummaryGetLambdaFn.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
  return performanceSummaryGetLambdaFn;
}
