import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { createHumanFirstPartyHandler } from '@humansecurity/aws-lambda-edge-enforcer';
import { getConfigAsync } from './custom/config';
import {HumanSecurityEnforcer} from "./px/humansecurity";


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
};
