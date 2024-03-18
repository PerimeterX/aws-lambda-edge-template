import { CloudFrontResponseEvent, CloudFrontRequestEvent, CloudFrontResponseResult, Context, CloudFrontResponseHandler } from 'aws-lambda';
import { createHumanActivitiesHandler } from '@humansecurity/aws-lambda-edge-enforcer';
import { getConfigAsync } from './custom/config';


// define a handler

let activitiesHandler: (event:CloudFrontResponseEvent, context: Context)=>
    Promise<CloudFrontResponseResult>;
export async function handler(
    event: CloudFrontResponseEvent,
    context: Context
): Promise<CloudFrontResponseResult> {

    if (!activitiesHandler){
        const config = await getConfigAsync();
        const activitiesHandler = createHumanActivitiesHandler(config); //(event: CloudFrontResponseEvent, context: Context) => Promise<CloudFrontResponseResult>;
    }

    return activitiesHandler(event,context);
};
