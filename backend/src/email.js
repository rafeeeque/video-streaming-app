import sgMail from '@sendgrid/mail'
import dotenv from 'dotenv';
dotenv.config();

export const send = async (to, base64Image, filename) => {
    try {
      const msg = {
        to: to,
        from: 'rafeequekhp134@gmail.com',
        subject: 'Sending an image',
        text: 'Check out this image!',
        attachments: [
          {
            content: base64Image,
            filename: filename,
            type: 'image/png',
            disposition: 'attachment',
            contentId: 'screenIMG',
          },
        ],
      };
      sgMail.setApiKey(`${process.env.SG_MAIL_API_KEY}`);
      sgMail.send(msg);
      } catch (error) {
        console.error('Error sending email:', error);
      }
}