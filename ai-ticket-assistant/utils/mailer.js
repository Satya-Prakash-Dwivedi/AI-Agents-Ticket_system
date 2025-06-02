import nodemailer from "nodemailer"

export const sendMail = async(to, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: process.env.MAILTRIP_SMTP_HOST,
            port: process.env.MAILTRIP_SMTP_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
              user: process.env.MAILTRIP_SMTP_USER,
              pass: process.env.MAILTRIP_SMTP_PASS,
            },
        });
        const info = await transporter.sendMail({
            from: 'Inngest TMS',
            to,
            subject,
            text, 
          });
        
        console.log("Message sent:", info.messageId);
        return info
    } catch (error) {
        console.error("❌ Error while sending email 📧", error.message);
        throw error;
    }
}