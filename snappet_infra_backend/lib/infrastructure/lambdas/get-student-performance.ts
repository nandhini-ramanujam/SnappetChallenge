import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CreateApiGatewayAuthorizer } from './authorizer';

export function createPerformanceDetailsLambda(scope: Construct, id: string, env: any): lambda.Function {

  const { STUDENTS_PERFORMANCE_TABLE } = env;

  // Lambda
  const performanceGetLambdaFn = new NodejsFunction(scope, 'GetStudentPerformanceLambda', {
    entry: `${path.join(__dirname, '../.././lambdas/get-student-performance')}/index.ts`,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    environment: {
      STUDENTS_PERFORMANCE_TABLE
    }
  });

  // API Gateway
  const api = new apigateway.RestApi(scope, 'get-student-performance', {
    deploy: true
  });

  // Authorizer
  const authorizer = CreateApiGatewayAuthorizer(scope, 'get-student-performance', api.restApiId)

  // Lambda integration with API Gateway
  const getPerformanceLambdaIntg = new apigateway.LambdaIntegration(performanceGetLambdaFn, {
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
  const performaceSummaryResource = api.root.addResource('student-performance', {
    defaultCorsPreflightOptions: {
      statusCode: 200,
      allowOrigins: ["*"],
      allowMethods: ['OPTIONS', 'GET'],
    }
  });

  // Api method 
  performaceSummaryResource.addMethod('GET', getPerformanceLambdaIntg, {
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

  performanceGetLambdaFn.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
  return performanceGetLambdaFn;
}
