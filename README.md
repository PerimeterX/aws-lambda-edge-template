# AWS Lambda@Edge Enforcer Sample Project

See the full official documentation for the Human Security AWS Lambda@Edge Enforcer [here](https://edocs.humansecurity.com/docs/installation-aws-lambda-edge).

## Use case
1. This repo allows you to generate templates for each Human Security AWS Lambda@Edge Enforcer lambda [Version 4](https://edocs.humansecurity.com/docs/installation-aws-lambda-edge) (and above).
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
   * <b>All other</b> configuration fields that you can read more about them [here](https://edocs.humansecurity.com/docs/configuration-aws-lambda-edge):
      *  The simple ones under `Simple function configuration` comment.
      * Custom functions that can be found under `Custom function configurations` comment.
4. Compile the enforcer by running `npm run zip` from the project directory.
5. Choose the relevant lambda from the 3 generated lambda zip files:
    * PXEnforcer.zip
    * PXActivities.zip
    * PXFirstParty.zip

## Deploy using AWS CloudFormation

### prerequisites:
1. AWS CLI installed and configured.
2. AWS S3 bucket to store the lambda zip files.

### Steps:
1. Store the lambda zip files in the S3 bucket using the following command:
    ```bash
    aws s3 cp PXEnforcer.zip s3://<bucket-name>/PXEnforcer.zip
    aws s3 cp PXActivities.zip s3://<bucket-name>/PXActivities.zip
    aws s3 cp PXFirstParty.zip s3://<bucket-name>/PXFirstParty.zip
    ```
2. Navigate to the `deploy` directory.
    ```bash
   cd deploy
    ```
3. Edit the `cfm_deploy.yaml` file and replace the placeholders with the relevant values:
 - `DomainName: "<ORIGIN_DOMAIN_URL>" ` 
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
 - First Party configuration - PathPattern: `"<PX_APP_ID_SUFFIX>/*"`
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
4. Deploy the CloudFormation stack using the following command (<b>NOTE: replace the placeholders with the relevant values</b>):
    ```bash
    aws cloudformation deploy \                                    
    --stack-name <stack-name> \
    --template-file cfm_deploy.yaml \
    --capabilities CAPABILITY_IAM \
    --parameter-overrides \
    HumanLambdaCodeBucket=<bucket-name> \
    EnforcerLambdaCodePath=PXEnforcer.zip \
    ActivitiesLambdaCodePath=PXActivities.zip \
    FirstPartyLambdaCodePath=PXFirstParty.zip
    ```
5. After the stack is created, you can find the CloudFront distribution URL in the CloudFormation stack outputs (or in the AWS UI).