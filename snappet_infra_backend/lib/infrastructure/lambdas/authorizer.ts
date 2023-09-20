import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as cognito from 'aws-cdk-lib/aws-cognito';

// Cognito userpool authorizer
export function CreateApiGatewayAuthorizer(scope: Construct, id: string, apiId: string) {
  const userPool = cognito.UserPool.fromUserPoolArn(scope, `snappet-${id}`, 'arn:aws:cognito-idp:eu-west-1:658340027427:userpool/eu-west-1_nxfpsYhVu');
  return new apigateway.CfnAuthorizer(scope, `snappet-authorizer-${id}`, {
    restApiId: apiId,
    name: `snappet-authorizer-${id}`,
    type: apigateway.AuthorizationType.COGNITO,
    identitySource: 'method.request.header.Authorization',
    providerArns: [userPool.userPoolArn],
  });
}