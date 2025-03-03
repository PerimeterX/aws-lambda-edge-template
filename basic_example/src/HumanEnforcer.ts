import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { HumanSecurityEnforcer } from './px/humansecurity'
import config from './custom/config.json';

// initialize the enforcer
let enforcer: HumanSecurityEnforcer;
// define a handler
export async function handler(
    event: CloudFrontRequestEvent,
    context: Context
): Promise<CloudFrontRequest | CloudFrontResponseResult> {
    // first, if the enforcer has not been initialized
    if (!enforcer) {
        // retrieve and await the configuration

        // initialize the enforcer
        enforcer = HumanSecurityEnforcer.initialize(config)
    }

    // the rest is the same logic as the default handler
    const request = event.Records[0].cf.request;
    const result = await enforcer.enforce(request);
    if (result) {
        //TODO here costumer can add his custom logic after costumer got block response
        return result;
    }

    //TODO custom logic here after passed our enforcer and didn't get blocked

    return request;
}
