const { VERIFICATION_EMAIL_TEMPLATE } = require('./emailTemplate');
const { client, sender } = require('./mailtrap');

const sendVerificationToken = async (email, verificationToken) => {
  const recipient = [{ email }]

  console.log(verificationToken);


  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
      category: "Email Verification",
    })
    // console.log("Email sent successfully", response);
  } catch (error) {
    console.log('Email sending verification', error);
    throw new Error('Error sending verification email ', error)
  }
}

const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];

  try {
    const response = await client.send({
      from: sender,
      to: recipient,
      template_uuid: "ac697c26-b0d7-4310-96b8-59d3e963fab3",
      template_variables: {
        company_info_name: "Mero Sathi",
        name: name,
      },
    });

    // console.log("Welcome email sent successfully", response);
  } catch (error) {
    console.error(`Error sending welcome email`, error);

    throw new Error(`Error sending welcome email: ${error}`);
  }
};

module.exports = {
  sendVerificationToken,
  sendWelcomeEmail
}