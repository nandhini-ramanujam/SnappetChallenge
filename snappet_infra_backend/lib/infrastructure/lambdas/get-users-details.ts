import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import path = require('path');
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import { CreateApiGatewayAuthorizer } from './authorizer';

export function createUserDetailsLambda(scope: Construct, id: string, env: any): lambda.Function {

  const { USERS_TABLE } = env;

  // Create Lambda Function
  const userDetailsGetLambdaFn = new NodejsFunction(scope, id, {
    entry: `${path.join(__dirname, '../.././lambdas/get-users-details')}/index.ts`,
    runtime: lambda.Runtime.NODEJS_18_X,
    handler: 'index.handler',
    environment: {
      USERS_TABLE
    }
  });

  // Create API Gateway
  const api = new apigateway.RestApi(scope, 'get-users-details', {
    deploy: true
  });

  // Create a Lambda integration with API Gateway
  const getUserDetailsLambdaInteg = new apigateway.LambdaIntegration(userDetailsGetLambdaFn, {
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
      'application/json': JSON.stringify({}),
    },
  });

  // Api resource
  const getUserDetailsResource = api.root.addResource('details', {
    defaultCorsPreflightOptions: {
      statusCode: 200,
      allowOrigins: ["*"],
      allowMethods: ['OPTIONS', 'GET'],
    }
  });

  // Authorizer
  const authorizer = CreateApiGatewayAuthorizer(scope, 'get-users-details', api.restApiId)

  // Api method
  getUserDetailsResource.addMethod('GET', getUserDetailsLambdaInteg, {
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

  userDetailsGetLambdaFn.grantInvoke(new iam.ServicePrincipal('apigateway.amazonaws.com'));
  return userDetailsGetLambdaFn;
}
