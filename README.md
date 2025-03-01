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
    ActivitiesLambdaCodePath=HumanActivities.zip \
    FirstPartyLambdaCodePath=HumanFirstParty.zip
    ```
5. After the stack is created, you can find the CloudFront distribution URL in the CloudFormation stack outputs (or in the AWS UI).
