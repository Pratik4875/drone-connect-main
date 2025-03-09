require("dotenv").config()
const nodemailer = require("nodemailer")

const transporter=nodemailer.createTransport({
    host: process.env.GMAIL_HOST,
    port: 465,
    secure:true,
    auth: {
        user:process.env.ADMIN_EMAIL ,
        pass: process.env.ADMIN_EMAIL_PASSWORD
    }
});

async function sendEmail(to,template, subject="DroneConnect | Email verification",attachments){
    var message = {
        from:process.env.ADMIN_EMAIL,
        to:to,
        subject:subject,
        html:template
    }

    /*
        Attachments is a array of objects. [{contentType:"", content:""}]
        *
        *
        * 
        */

    if(attachments && attachments.length >0){
        let validAttachments=[]

        attachments.forEach((attachment)=>{
            if((Object.keys(attachment)).length>0){
                validAttachments.push(attachment)
            }
        })

        console.log("Attachments for email")
        console.log(validAttachments)
        message.alternatives = validAttachments
    }

   // console.log(transporter)
    
    let info = await transporter.sendMail(message)
    if(info){
        return true
    }
    return false
}
module.exports=sendEmail
