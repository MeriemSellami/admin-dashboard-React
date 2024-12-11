const nodemailer = require('nodemailer');

// Create a transporter object using SMTP settings from the .env file
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,       // Gmail's SMTP server (smtp.gmail.com)
    port: process.env.SMTP_PORT,       // Port for SMTP (587 for TLS)
    secure: false,                     // Set to false for TLS (587), for SSL set it to true (465)
    auth: {
        user: process.env.EMAIL_USER,  // Your email address
        pass: process.env.EMAIL_PASS   // Your app-specific password
    },
    tls: {
        rejectUnauthorized: false      // Allow connections even if there are issues with the SSL certificate
    }
});

// Function to send emails
const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,    // Sender email
        to: to,                          // Recipient email
        subject: subject,                // Email subject
        text: text                       // Email body
    };

    // Send the email
    return transporter.sendMail(mailOptions)
        .then(info => console.log('Email sent: ' + info.response))
        .catch(err => console.error('Error sending email: ' + err));
};

// Export the function
module.exports = sendEmail;