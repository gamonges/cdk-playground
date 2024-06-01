#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { VpcStack } from '../lib/network';
import { RedisServerlessStack } from '../lib/cdk-playground-stack';

const app = new cdk.App();
const vpcStack = new VpcStack(app, 'VpcStack');
const redisCacheStack = new RedisServerlessStack(app, 'CdkPlaygroundStack', {
  vpcStack: vpcStack,
});

redisCacheStack.addDependency(vpcStack);
