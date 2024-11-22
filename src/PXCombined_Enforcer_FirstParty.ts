import { CloudFrontRequest, CloudFrontRequestEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { HumanSecurityEnforcer, HumanSecurityFirstParty } from './px/humansecurity';
import { getConfigAsync } from './custom/config';


// define and export a handler
export async function handler(
    event: CloudFrontRequestEvent,
    context: Context
): Promise<CloudFrontRequest | CloudFrontResponseResult> {
    // extract request from event
    const request = event.Records[0].cf.request;

    // retrieve and await the configuration
    const config = await getConfigAsync();

    // initialize enforcer and first party
    const enforcer = HumanSecurityEnforcer.initialize(config);
    const firstParty = HumanSecurityFirstParty.initialize(config);


    // handle first party before calling enforce or other custom logic
    const firstPartyResult = await firstParty.handleFirstParty(request, context);

    // if the result exists, the incoming request is a HUMAN first party request
    // the result should be returned from the handler
    if (firstPartyResult) {
        return firstPartyResult;
    }

    // if the request is not first party, we should enforce the incoming request
    const blockResponse = await enforcer.enforce(request);

    // if we received a response, we should return it from the handler
    // this will return the block response to the end user and prevent the
    // request from reaching the origin server
    if (blockResponse) {
        return blockResponse;
    }

    // if we did not receive a block response, the request can be processed
    // using custom logic as desired and eventually returned from the handler
    // to pass it along to the origin server
    return request;
}