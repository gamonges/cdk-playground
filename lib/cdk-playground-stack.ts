import { Construct } from 'constructs';
import {
  aws_elasticache as cache,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Peer, Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { VpcStack } from './network';

type RedisStackProps = cache.CfnServerlessCacheProps & {};

export class RedisServerlessStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & { vpcStack: VpcStack }
  ) {
    super(scope, id, props);

    const cacheSecurityGroup = new SecurityGroup(this, 'CacheSecurityGroup', {
      vpc: props.vpcStack.vpc,
      securityGroupName: 'redis',
      description: 'hogehoge',
    });
    cacheSecurityGroup.addIngressRule(
      Peer.ipv4(props.vpcStack.vpc.vpcCidrBlock),
      Port.tcp(6379)
    );
    cacheSecurityGroup.addIngressRule(
      Peer.ipv4(props.vpcStack.vpc.vpcCidrBlock),
      Port.tcp(6380)
    );

    const redisProps: RedisStackProps = {
      engine: 'redis',
      serverlessCacheName: 'redis-playground',
      description: 'for inspection of import cdk',
      majorEngineVersion: '7',

      subnetIds: [
        props.vpcStack.subnet1.subnetId,
        props.vpcStack.subnet3.subnetId,
      ],
    };
    const redisCache = new cache.CfnServerlessCache(
      this,
      'RedisCache',
      redisProps
    );

    redisCache.applyRemovalPolicy(RemovalPolicy.RETAIN);
  }
}
