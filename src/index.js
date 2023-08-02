const core = require("@actions/core");
const NotifyClient = require("notifications-node-client").NotifyClient;
const uuid = require("uuid4");

const main = () => {
  const apiKey = core.getInput("api-key");
  const apiEndpoint = core.getInput("api-endpoint");
  const messageType = core.getInput("message-type");
  const recipient = core.getInput("recipient");
  const templateId = core.getInput("template-id");

  var personalisation = core.getInput("personalisation");
  var reference = core.getInput("reference");

  const notifyClient = new NotifyClient(apiEndpoint, apiKey);

  try {
    personalisation = JSON.parse(personalisation);
  } catch (err) {
    core.setFailed(err);
  }

  if (!reference || reference.trim === "") {
    reference = uuid();
  }

  if (messageType === "email") {
    notifyClient
      .sendEmail(templateId, recipient, personalisation, reference)
      .then(console.log(`Email sent with reference: ${reference}`))
      .catch((err) => core.setFailed(err));
  } else if (messageType === "sms") {
    notifyClient
      .sendSms(templateId, recipient, personalisation, reference)
      .then(console.log(`SMS sent with reference: ${reference}`))
      .catch((err) => core.setFailed(err));
  } else {
    core.setFailed(`Message type: ${messageType} not supported`);
  }
};

main();

exports.main = main;
