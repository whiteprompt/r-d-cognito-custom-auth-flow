# Auth with Cognito - SMS Login with Pinpoint

This example shows how to configure an existing Cognito User Pool with Lambda
Triggers to implement a passwordless authentication driven by SMS.

The example uses the serverless framework to automate the configuration of the 
Lambda Triggers. Make sure it is installed and correctly configured with your
AWS account. 

You'll need also a Pinpoint Application configured with the SMS Channel enabled 
and a phone number configured to send SMS.

## Using this example

Clone the repository, `cd` into `auth` and make a copy of `.env.example` 
renaming it `.env`, and edit the values of the environment variables in the 
file.

* `AWS_REGION` the AWS region where the existing user pool is
* `AWS_COGNITO_USER_POOL` the name of the existing user pool
* `AWS_PINPOINT_APP_ID` the ID of the Pinpoint application
* `AWS_PINPOINT_SMS_KEYWORD` the SMS Keyword of the originating phone number
* `AWS_PINPOINT_SMS_ORIGINATION_NUMBER` the originating phone number in E.164 format
* `AWS_PINPOINT_REGION` the region of the Pinpoint application
* `ENVIRONMENT_CODE` the name of the serverless application stage

With the variables set, you can deploy this example using `dotenv-cli` by 
executing `dotenv -e .env -- serverless deploy`.
