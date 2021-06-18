const Mailgen = require("mailgen");
const config = require("../config/config");

class MailService {
  constructor(env, sender) {
    this.sender = sender;
    switch (env) {
      case "development":
        this.link = config.link.development;
        break;
      case "production":
        this.link = config.link.production;
        break;
      default:
        this.link = config.link.development;
        break;
    }
  }

  #createTemplateVerifyEmail(token, email) {
    const mailGenerator = new Mailgen({
      theme: "cerberus",
      product: {
        name: "Contacts",
        link: this.link,
      },
    });
    const confEmail = {
      body: {
        email,
        intro: "Welcome to Contacts! We're very excited to have you on board.",
        action: {
          instructions: "To get started with Contacts, please click here:",
          button: {
            color: "#22BC66", // Optional action button color
            text: "Confirm your account",
            link: `${this.link}/api/users/verify/${token}`,
          },
        },
      },
    };
    console.log("confEmail", confEmail.body.action.button.link);
    // Generate an HTML email with the provided contents
    return mailGenerator.generate(confEmail);
  }

  async sendVerifyEmail(token, email) {
    console.log("sendVerifyEmail", token, email);
    const emailBody = this.#createTemplateVerifyEmail(token, email);
    const result = await this.sender.send({
      to: email,
      subject: "Verify your account",
      html: emailBody,
    });
    console.log(result);
  }
}

module.exports = MailService;
