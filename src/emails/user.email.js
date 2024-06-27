import nodemailer from "nodemailer";

export const sendEmail = async (to, subject, html) => {
  try {
    let transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      service: 'gmail',
      auth: {
        user: 'miladshehata513@gmail.com',
        pass: 'rwgdofzhejzhafic',
      },
    });

    const info = {
      from: '"melad 👻" <miladshehata513@gmail.com>',
      to,
      subject,
      html,
    };

    await transporter.sendMail(info);
    console.log('Email sent successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};