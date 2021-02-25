import nodemailer, { Transporter } from "nodemailer";


export class SendMailService{

    private client: Transporter

    constructor(){
        nodemailer.createTestAccount().then(account=>{
            const transporter = nodemailer.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            });

            this.client = transporter;
        });
    }

    async execute(){
        
    }
}