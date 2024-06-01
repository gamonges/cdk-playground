import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class VpcStack extends cdk.Stack {
  public readonly vpc: ec2.Vpc;
  public readonly subnet1: ec2.Subnet;
  public readonly subnet2: ec2.Subnet;
  public readonly subnet3: ec2.Subnet;

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPCの作成
    this.vpc = new ec2.Vpc(this, 'MyVpc', {
      ipAddresses: ec2.IpAddresses.cidr('10.0.0.0/16'),
      maxAzs: 3,
      subnetConfiguration: [],
    });

    // サブネットの作成
    this.subnet1 = new ec2.Subnet(this, 'Subnet1', {
      vpcId: this.vpc.vpcId,
      availabilityZone: this.vpc.availabilityZones[0],
      cidrBlock: '10.0.1.0/24',
    });

    this.subnet2 = new ec2.Subnet(this, 'Subnet2', {
      vpcId: this.vpc.vpcId,
      availabilityZone: this.vpc.availabilityZones[1],
      cidrBlock: '10.0.2.0/24',
    });

    this.subnet3 = new ec2.Subnet(this, 'Subnet3', {
      vpcId: this.vpc.vpcId,
      availabilityZone: this.vpc.availabilityZones[2],
      cidrBlock: '10.0.3.0/24',
    });

    // ルートテーブルの作成
    const routeTable1 = new ec2.CfnRouteTable(this, 'RouteTable1', {
      vpcId: this.vpc.vpcId,
    });

    const routeTable2 = new ec2.CfnRouteTable(this, 'RouteTable2', {
      vpcId: this.vpc.vpcId,
    });

    const routeTable3 = new ec2.CfnRouteTable(this, 'RouteTable3', {
      vpcId: this.vpc.vpcId,
    });

    // ルートテーブルの関連付け
    new ec2.CfnSubnetRouteTableAssociation(
      this,
      'Subnet1RouteTableAssociation',
      {
        subnetId: this.subnet1.subnetId,
        routeTableId: routeTable1.ref,
      }
    );

    new ec2.CfnSubnetRouteTableAssociation(
      this,
      'Subnet2RouteTableAssociation',
      {
        subnetId: this.subnet2.subnetId,
        routeTableId: routeTable2.ref,
      }
    );

    new ec2.CfnSubnetRouteTableAssociation(
      this,
      'Subnet3RouteTableAssociation',
      {
        subnetId: this.subnet3.subnetId,
        routeTableId: routeTable3.ref,
      }
    );
  }
}
