// snippet-start:[ses.JavaScript.email.sendEmailV3]
const {SendEmailCommand} = require("@aws-sdk/client-ses");
const { sesClient } =require("./sesClient.js");

const createSendEmailCommand = (toAddress, fromAddress, subject, body) => {

  return new SendEmailCommand({
    Destination: {
      CcAddresses: [
      ],
      ToAddresses: [
        toAddress,
      ],
    },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `<h1>${body}</h1>`,
        },
        Text: {
          Charset: "UTF-8",
          Data: "This is text body format",
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
    Source: fromAddress,
    ReplyToAddresses: [
    ],
  });
};

const run = async (subject, body) => {
  const sendEmailCommand = createSendEmailCommand(
    "abhinandansah50@gmail.com",
    "abhinandansah222@gmail.com",
    subject, 
    body, 
  );

  try {
    return await sesClient.send(sendEmailCommand);
  } catch (caught) {
    if (caught instanceof Error && caught.name === "MessageRejected") {
      /** @type { import('@aws-sdk/client-ses').MessageRejected} */
      const messageRejectedError = caught;
      return messageRejectedError;
    }
    throw caught;
  }
};

// snippet-end:[ses.JavaScript.email.sendEmailV3]
module.exports = { run };