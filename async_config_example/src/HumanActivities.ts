import { CloudFrontResponseEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { createHumanActivitiesHandler } from './px/humansecurity';
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
        activitiesHandler = createHumanActivitiesHandler(config); //(event: CloudFrontResponseEvent, context: Context) => Promise<CloudFrontResponseResult>;
    }

    return activitiesHandler(event,context);
}
