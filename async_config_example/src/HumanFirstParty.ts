import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { createHumanFirstPartyHandler } from './px/humansecurity';
import { getConfigAsync } from './custom/config';


// define a handler
let firstPartyHandler: (event: CloudFrontRequestEvent, context: Context)=>
    Promise<CloudFrontRequest | CloudFrontResponseResult>
export async function handler(
    event: CloudFrontRequestEvent,
    context: Context
): Promise<CloudFrontRequest | CloudFrontResponseResult> {

    if (!firstPartyHandler){
        const config = await getConfigAsync();
        firstPartyHandler = createHumanFirstPartyHandler(config);
    }

    return firstPartyHandler(event,context);
}
