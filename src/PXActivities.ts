import { CloudFrontResponseEvent, CloudFrontResponseResult, Context, CloudFrontResponseHandler } from 'aws-lambda';
import { HumanSecurityPostEnforcer } from './px/humansecurity';
import { getConfigAsync } from './custom/config';


// define a handler

let activitiesHandler: HumanSecurityPostEnforcer
export async function handler(
    event: CloudFrontResponseEvent,
    context: Context
): Promise<CloudFrontResponseResult> {

    if (!activitiesHandler){
        const config = await getConfigAsync();
        activitiesHandler = HumanSecurityPostEnforcer.initialize(config); //(event: CloudFrontResponseEvent, context: Context) => Promise<CloudFrontResponseResult>;
    }
    const request = event.Records[0].cf.request
    const response = event.Records[0].cf.response

    // call and await the postEnforce() function
    await activitiesHandler.postEnforce(request,response);

    // return the response
    return response;
}
