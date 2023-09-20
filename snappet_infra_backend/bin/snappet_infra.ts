#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SnappetInfraStack } from '../lib/snappet_infra-stack';

const app = new cdk.App();
new SnappetInfraStack(app, 'SnappetInfraStack', {});