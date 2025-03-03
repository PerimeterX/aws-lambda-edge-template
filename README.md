# AWS Lambda@Edge Enforcer Sample Project

See the full official documentation for the Human Security AWS Lambda@Edge Enforcer [here](https://docs.humansecurity.com/applications-and-accounts/docs/whats-new-aws-lambda-edge).

## Use case
1. This repo allows you to generate templates for each Human Security AWS Lambda@Edge Enforcer lambda [Version 4](https://docs.humansecurity.com/applications-and-accounts/docs/whats-new-aws-lambda-edge) (and above).
2. The lambdas are customized and allow you to:
   - Edit the enforcer configuration in a separate file.
   - Use async calls to fetch specific configuration values.
   - Add your custom logic to the enforcer request/response when the handler starts and before the handler finishes, and then send it to the next handler you define.

## How to use
1. git clone the project into your working directory.
2. Install dependencies with `npm install`.
3. Configure the enforcer by modifying the `src/custom/config.ts` file.
   </br> Under this file you can find 3 types of configuration parameters:
   * <b>Mandatory</b> configuration fields that can be found under `Mandatory configurations` comment:   
      * `PX_APP_ID` - The application ID (available in the [portal](https://console.perimeterx.com/))
      * `PX_AUTH_TOKEN` - The server token (available in the [portal](https://console.perimeterx.com/))
      * `PX_COOKIE_SECRET` - The cookie secret associated with the Bot Defender security policy (available in the [portal](https://console.perimeterx.com/))
   * <b>All other</b> configuration fields that you can read more about them [here](https://docs.humansecurity.com/applications-and-accounts/docs/configuration-aws-lambda-edge):
      *  The simple ones under `Simple function configuration` comment.
      * Custom functions that can be found under `Custom function configurations` comment.
4. Compile the enforcer by running `npm run zip` from the project directory.
5. Choose the relevant lambda from the 3 generated lambda zip files:
    * HumanEnforcer.zip
    * HumanActivities.zip
    * HumanFirstParty.zip
6. Deploy the lambda to AWS Lambda@Edge using the AWS console, AWS CLI or Cloudformation using the instructions below.

## Deploy using AWS CloudFormation

### prerequisites:
1. Complete the instructions in the `How to use` section and make sure you have the lambda zip files.
2. AWS CLI installed and configured.
3. AWS S3 bucket to store the lambda zip files.

*Note*: The following steps are for deploying the Human Security Enforcer to a new CloudFront distribution.
The deployment includes the HumanEnforcer lambda and the HumanFirstParty lambda. The HumanActivities lambda is not included in the deployment, to add it, please follow the "How to add HumanActivitiesLambda" instructions at the end of this document, before deploying the CloudFormation stack.

### Steps:
1. Store the lambda zip files in the S3 bucket using the following command:
    ```bash
    aws s3 cp HumanEnforcer.zip s3://<bucket-name>/HumanEnforcer.zip
    aws s3 cp HumanActivities.zip s3://<bucket-name>/HumanActivities.zip
    aws s3 cp HumanFirstParty.zip s3://<bucket-name>/HumanFirstParty.zip
    ```
2. Navigate to the `deploy` directory.
    ```bash
   cd deploy
    ```
3. Edit the `cfm_deploy.yaml` file and replace the placeholders with the relevant values:
 - `DomainName: "<ORIGIN_DOMAIN_URL>" `
 - <b>Example:</b> `- DomainName: "example.com"`
```yaml
     CloudFrontDistribution:
    Type: "AWS::CloudFront::Distribution"
    Properties:
      DistributionConfig:
        Enabled: true
        Origins:
          - DomainName: "<ORIGIN_DOMAIN_URL>"
            Id: "ExampleOrigin"
            CustomOriginConfig:
              HTTPPort: 80
              HTTPSPort: 443
              OriginProtocolPolicy: "https-only"
   ```
 - PathPattern: `"<PX_APP_ID_SUFFIX>/*"`
 - <b>Example</b>: for PX_APP_ID: `pxapp12345` the `PX_APP_ID_SUFFIX` is `app12345` (Remove the PX prefix from the app_id)
```yaml
        CacheBehaviors:
          - PathPattern: "<PX_APP_ID_SUFFIX>/*"
            AllowedMethods:
                - "GET"
                - "HEAD"
                - "OPTIONS"
                - "PUT"
                - "POST"
                - "PATCH"
                - "DELETE"
```
Example:
```yaml
        CacheBehaviors:
          - PathPattern: "pxapp12345/*"
            AllowedMethods:
                - "GET"
                - "HEAD"
                - "OPTIONS"
                - "PUT"
                - "POST"
                - "PATCH"
                - "DELETE"
```
4. Deploy the CloudFormation stack using the following command (<b>NOTE: replace the placeholders with the relevant values - `<stack-name>` and `<bucket-name>` </b>):
    ```bash
    aws cloudformation deploy \                                    
    --stack-name <stack-name> \
    --template-file cfm_deploy.yaml \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    HumanLambdaCodeBucket=<bucket-name> \
    EnforcerLambdaCodePath=HumanEnforcer.zip \
    FirstPartyLambdaCodePath=HumanFirstParty.zip
    ```
5. After the stack is created, you can find the CloudFront distribution URL in the CloudFormation stack outputs (or in the AWS UI).

## How to add HumanActivitiesLambda

HumanActivitiesLambda is an optional additional lambda, that runs on viewer request and can be used to send additional activities to the Human Security API.
This Lambda is in charge of generating the Human Security PXHD cookie, and needs to be deployed in case you're using advanced features such as Credential Intelligence or GraphQL protection.

To add the HumanActivitiesLambda to the CloudFormation stack, follow these steps:

Adjust your cfm_deploy.yaml file to include the HumanActivitiesLambda (before deployment):

1. Create the Activities Lambda by adding the following resource to your deployment yaml (after `EnforcerExecutionRole`, at line 65):
```yaml
  HumanActivitiesLambda:
    Type: "AWS::Lambda::Function"
    Properties:
      FunctionName: "human-security-activities-lambda"
      Handler: "index.handler"
      Role: !GetAtt EnforcerExecutionRole.Arn
      Runtime: "nodejs20.x"
      Code:
        S3Bucket: !Ref HumanLambdaCodeBucket
        S3Key: !Ref ActivitiesLambdaCodePath

  HumanActivitiesLambdaFunctionVersion:
    Type: "AWS::Lambda::Version"
    Properties:
      FunctionName: !Ref HumanActivitiesLambda
```

2. Add to `LambdaFunctionAssociations` an `origin-response` EventType, with the following association: LambdaFunctionARN: !Ref HumanActivitiesLambdaFunctionVersion
Example: 
```yaml
            LambdaFunctionAssociations:
              - EventType: "viewer-request"
                LambdaFunctionARN: !Ref HumanEnforcerLambdaFunctionVersion
              - EventType: "origin-response"
                LambdaFunctionARN: !Ref HumanActivitiesLambdaFunctionVersion
```
3. Add the `ActivitiesLambdaCodePath` variable at the end of the yaml file, example:
```yaml
    ActivitiesLambdaCodePath:
    Type: String
    Description: "S3 path for the Activities Lambda code zip file."
```
4. Run the deployment command using the 3 lambdas:
```bash
aws cloudformation deploy \                                    
--stack-name <stack-name> \
--template-file cfm_deploy.yaml \
--capabilities CAPABILITY_IAM \
--parameter-overrides \
HumanLambdaCodeBucket=<bucket-name> \
EnforcerLambdaCodePath=HumanEnforcer.zip \
ActivitiesLambdaCodePath=HumanActivities.zip \
FirstPartyLambdaCodePath=HumanFirstParty.zip
```