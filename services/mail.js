import nodemailer from 'nodemailer';

const sendTextEmail = (recipient, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 587,
    secure: false, 
    auth: {
      user: 'username', 
      pass: 'password' 
    }  
  });

  const mailOptions = {
    from: 'sender@example.com',  
    to: recipient,      
    subject: subject,
    text: text
  };

  transporter.sendMail(mailOptions, function(err, info) {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
}


export default {
  sendTextEmail
}