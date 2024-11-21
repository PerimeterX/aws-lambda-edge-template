// config.ts
import { HumanSecurityConfiguration } from '@humansecurity/aws-lambda-edge-enforcer';

// define configuration
const config: HumanSecurityConfiguration = {
    // Mandatory configurations
    px_app_id: '<APP_ID>',
    px_auth_token: '<AUTH_TOKEN>',
    px_cookie_secret: '<COOKIE_SECRET>',
};

export async function getConfigAsync(){
    //Here you can use  async/await syntax for blocking requests and assign them to your HumanSecurityConfiguration
    return config;
}
