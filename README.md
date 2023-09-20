# Snappet web app

## Introduction

This web application is built with Angular and integrates with various AWS services for secure authentication, data retrieval, and storage.

- Web Application Host: hosted in https://d3jc204md9jxdy.cloudfront.net/ (You can signup and login with your email)

- Authentication Mechanism - built with AWS Cognito service & AWS Amplify.

- API Gateway - Api gateways are protected with AWS userpool authorizer.

- AWS stack - AWS infrastucture is built with AWS CDK

- Microservices are built with AWS lambda.

## Features

- Dashboard to visualize today's overall engagement of the whole class in each subjct.
- Student performance overview to visualize today's performance in various subjects.

### Prerequisites to run the frontend application in local

- Angular: Version 16.0.0
- NodeJS: Version 18.16.0

### Installation

Navigate to the frontend application

```bash
cd snappet_frontend
```

Install dependancies

```bash
npm install
```

Start application

```bash
npm run start
```

Run unit tests

```bash
npm run test
```

Backend application

Navigate to snappet_infra_backend from the root of the directory to to check the
AWS infrastructure built with AWS CDK & microservices.
