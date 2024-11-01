import { mailtrapClient, sender } from './mail.config.js'
import { VERIFICATION_EMAIL_TEMPLATE } from "./Email.template.js"

export const sendVerificationEmail= async (email, verificationToken)=>{
    const recipient= [{email}]

    try{
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
            category: "Email Verification"
        });
        console.log("email sent successfully", response)
    }catch(e){
        console.log("error sending email", e)
       
    }
}