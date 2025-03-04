import { CloudFrontResponseEvent, CloudFrontResponseResult, Context } from 'aws-lambda';
import { createHumanActivitiesHandler } from './px/humansecurity';
import config from './custom/config.json';


// define a handler

let activitiesHandler: (event:CloudFrontResponseEvent, context: Context)=>
    Promise<CloudFrontResponseResult>;
export async function handler(
    event: CloudFrontResponseEvent,
    context: Context
): Promise<CloudFrontResponseResult> {

    if (!activitiesHandler){
        activitiesHandler = createHumanActivitiesHandler(config); //(event: CloudFrontResponseEvent, context: Context) => Promise<CloudFrontResponseResult>;
    }

    return activitiesHandler(event,context);
}
