# AWS Lambda@Edge Enforcer Sample Project

See the full official documentation for the Human Security AWS Lambda@Edge Enforcer [here](https://edocs.humansecurity.com/docs/installation-aws-lambda-edge).

## Use case
1. This repo allows you to generate templates for each Human Security AWS Lambda@Edge Enforcer lambda [Version 4](https://edocs.humansecurity.com/docs/installation-aws-lambda-edge) (and above).
2. All lambdas are customized and allow you to:
   - Edit the enforcer configuration in a separate file.
   - Use async calls to fetch specific configuration values.
   - Add your custom logic to the enforcer request/response when the handler starts and before the handler finishes, and then send it to the next handler you define.
3. The PXCombined_Enforcer_FirstParty lambda allows you to combine two lambdas (FirstParty and Enforcer lambda) in one handler function. 
   This isn't the recommended way of using our enforcer lambdas and should be used carefully after consulting with our Solution Architects to understand the impact of this 
   implementation.
    

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
5. Choose the relevant lambda from the 4 generated lambda zip files:
    * PXEnforcer.zip
    * PXActivities.zip
    * PXFirstParty.zip
    * PXCombined_Enforcer_FirstParty.zip
