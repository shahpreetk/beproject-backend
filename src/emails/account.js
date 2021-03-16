const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "preetwebdev@gmail.com",
      subject: "Thanks for joining us!",
      text: `Welcome to the app, ${name}. Hope you like it!`,
    })
    // .then(() => {
    //   console.log("Signup Email sent");
    // })
    .catch((error) => {
      console.error(error.body);
    });
};

const sendCancellationEmail = ({ email, name }) => {
  sgMail
    .send({
      to: email,
      from: "preetwebdev@gmail.com",
      subject: "We'll miss you!",
      text: `We are sorry to see you go, ${name}. See you soon!`,
    })
    // .then(() => {
    //   console.log("Exit Email sent");
    // })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = {
  sendWelcomeEmail,
  sendCancellationEmail,
};
