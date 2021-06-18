const sgMail = require("@sendgrid/mail");
const nodemailer = require("nodemailer");
require("dotenv").config();
const configEmail = require("../config/config");

class CreateSenderSG {
  async send(message) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    return await sgMail.send({ ...message, from: configEmail.email.sendgrid });
  }
}

class CreateSenderNM {
  async send(message) {
    const config = {
      host: "smtp.meta.ua",
      port: 465,
      secure: true,
      auth: {
        user: configEmail.email.nodemailer,
        pass: process.env.PASSWORD,
      },
    };

    const transporter = nodemailer.createTransport(config);
    const emailOptions = {
      from: configEmail.email.nodemailer,
      ...message,
    };

    return await transporter.sendMail(emailOptions);
  }
}

module.exports = { CreateSenderSG, CreateSenderNM };
