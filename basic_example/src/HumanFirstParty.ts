import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { createHumanFirstPartyHandler } from './px/humansecurity';
import config from './custom/config.json';


// define a handler
let firstPartyHandler: (event: CloudFrontRequestEvent, context: Context)=>
    Promise<CloudFrontRequest | CloudFrontResponseResult>
export async function handler(
    event: CloudFrontRequestEvent,
    context: Context
): Promise<CloudFrontRequest | CloudFrontResponseResult> {

    if (!firstPartyHandler){
        firstPartyHandler = createHumanFirstPartyHandler(config);
    }

    return firstPartyHandler(event,context);
}
