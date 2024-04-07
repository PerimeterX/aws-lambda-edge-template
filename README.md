# aws-lambda-edge-template

See the full official documentation for the Human Security AWS Lambda@Edge Enforcer [here](https://docs.perimeterx.com/docs/installation-azure).

1. git clone the project into your working directory.
2. Install dependencies with `npm install`.
3. Configure the enforcer by modifying the `src/custom/config.ts` file. 
   </br> Under this file you can find 3 types of configuration paremeters: 
   * <b>manadorty</b> configuration fields that can be found under `Mandatory configurations` comment:   
      * `PX_APP_ID` - The application ID (available in the [portal](https://console.perimeterx.com/))
      * `PX_AUTH_TOKEN` - The server token (available in the [portal](https://console.perimeterx.com/))
      * `PX_COOKIE_SECRET` - The cookie secret associated with the Bot Defender security policy (available in the [portal](https://console.perimeterx.com/))
   * <b>All other</b> configuration fields that you can read more about them [here](https://edocs.humansecurity.com/docs/configuration-aws-lambda-edge):
      *  The simple ones under `Simple function configuration` comment.
      * Custom functions that can be found under `Custom function configurations` comment.
4. Compile the enforcer by running `npm run zip`.
5. Choose the relevant lambda from the 3 generated lambda zip files:
    * PXEnforcer.zip
    * PXActivities.zip
    * PXFirstParty.zip
