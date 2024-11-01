const { MailtrapClient } = require("mailtrap");
const dotenv = require('dotenv').config();


const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOKEN,
});

const sender = {
  email: "hello@demomailtrap.com",
  name: "Mero Sathi",
};

module.exports = {
  client,
  sender
}