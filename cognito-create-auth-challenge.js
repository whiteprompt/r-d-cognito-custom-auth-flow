const {randomDigits} = require('crypto-secure-random-digit');
const {sendSMS} = require('./helpers/pinpoint');

module.exports = {
  async handler (event) {
    let secretLoginCode;

    if (!event.request.session || !event.request.session.length) {
      secretLoginCode = randomDigits(6).join('');
      const messageSource = `WhitePrompt${
        process.env.ENVIRONMENT_CODE !== 'PRD' && '-'+process.env.ENVIRONMENT_CODE
      }`;
      await sendSMS(
        event.request.userAttributes.phone_number,
        `This is your ${messageSource} code:\n${secretLoginCode}`
      );
    } else {
      const previousChallenge = event.request.session.slice(-1)[0];
      secretLoginCode = previousChallenge.challengeMetadata.match(/(\d*)/)[1];
    }

    // This is sent back to the client app
    event.response.publicChallengeParameters = {
      email: event.request.userAttributes.email
    };

    // Add the secret login code to the private challenge parameters
    // so it can be verified by the "Verify Auth Challenge Response" trigger
    event.response.privateChallengeParameters = {secretLoginCode};

    // Add the secret login code to the session so it is available
    // in a next invocation of the "Create Auth Challenge" trigger
    event.response.challengeMetadata = `${secretLoginCode}`;

    return event;
  }
}
