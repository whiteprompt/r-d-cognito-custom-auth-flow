const AWS = require('aws-sdk');
const pinpoint = new AWS.Pinpoint({
  region: process.env.AWS_PINPOINT_REGION || 'us-east-1'
});

module.exports = {
  /**
   * Sends an SMS to a number
   * @param {string} destinationNumber The phone number that will receive the message in E.164 format
   * @param {string} message The content of the message to be sent. keep it under 140 chars
   * @param {string} originationNumber The phone number that will send the message in E.164 format (needs to be associated in the pinpoint account)
   * @param {string} pinpointProjectId The id of the pinpoint project in the AWS console
   * @param {string} messageType TRANSACTIONAL | PROMOTIONAL
   * @param {string} registeredKeyword keyword associated to the originationNumber
   * @returns {Promise<Pinpoint.SendMessagesResponse & {$response: Response<Pinpoint.SendMessagesResponse, Error & {code: string, message: string, retryable?: boolean, statusCode?: number, time: Date, hostname?: string, region?: string, retryDelay?: number, requestId?: string, extendedRequestId?: string, cfId?: string, originalError?: Error}>}>}
   */
  async sendSMS(
    destinationNumber,
    message,
    originationNumber = process.env.AWS_PINPOINT_SMS_ORIGINATION_NUMBER,
    pinpointProjectId = process.env.AWS_PINPOINT_APP_ID,
    messageType = 'TRANSACTIONAL',
    registeredKeyword = process.env.AWS_PINPOINT_SMS_KEYWORD
  ) {
    let messageRequest;

    try {
      const params = {
        ApplicationId: pinpointProjectId,
        MessageRequest: {
          Addresses: {
            [destinationNumber]: {
              ChannelType: 'SMS'
            }
          },
          MessageConfiguration: {
            SMSMessage: {
              Body: message,
              Keyword: registeredKeyword,
              MessageType: messageType,
              OriginationNumber: originationNumber
            }
          }
        }
      };
      messageRequest = await pinpoint.sendMessages(params).promise();
    } catch (e) {
      throw e;
    }

    if (messageRequest.MessageResponse.Result[destinationNumber].DeliveryStatus !== 'SUCCESSFUL') {
      throw new Error(messageRequest.MessageResponse.Result[destinationNumber].StatusMessage)
    }

    return messageRequest;
  }
}
