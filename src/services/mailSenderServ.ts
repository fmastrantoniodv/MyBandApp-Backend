import { saveVerifyCodeDB } from '../db/usersDBManager';
import { DBResponse, ServResponse } from '../interfaces';
import { dbgConsoleLog, errorConsoleLog, getStackFileName } from '../utils'
const FILENAME = getStackFileName()
//const nodemailer = require('nodemailer');
import dotenv from 'dotenv';
dotenv.config();

const sgMail = require('@sendgrid/mail')
console.log(`process.env=`,process.env)
console.log(`sendgrid_api_key=${process.env.SENDGRID_API_KEY}`)
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

export const sendVerificationCode = async (email: string): Promise<ServResponse> =>{
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[sendVerificationCode].Init`)
    dbgConsoleLog(FILENAME, `[sendVerificationCode].saveVerifyCodeDB.pre`)
    const createAndSaveVerifyCode: DBResponse = await saveVerifyCodeDB(email)
    dbgConsoleLog(FILENAME, `[sendVerificationCode].saveVerifyCodeDB.result=${createAndSaveVerifyCode.result}`)
    if(!createAndSaveVerifyCode.success){
      resp.result = createAndSaveVerifyCode.result
      return resp
    } 
    //dbgConsoleLog(FILENAME, `[sendVerificationCode].Create transport`)
    const msg = {
      to: email, 
      from: 'franco.mastrantonio@davinci.edu.ar',
      subject: 'Código de verificacion - MyBanddApp',
      html: `<strong>Tu código de verificación es: ${createAndSaveVerifyCode.result}</strong>`,
    }
    dbgConsoleLog(FILENAME, `[sendVerificationCode].msg=`, msg)
    await sgMail
      .send(msg)
      .then((res: any) => {
        dbgConsoleLog(FILENAME, `[sendVerificationCode].Email sent.res.statusCode=${res['0'].statusCode}`)
        if(res['0'].statusCode === 202){
          resp.success = true
          resp.result = `Se envió el correo a ${email}`  
        }else{
          resp.result = res['0'];
        }
      })
      .catch((error: any) => {
        resp.result = `ERROR_SEND_MAIL`
        errorConsoleLog(FILENAME, `[sendVerificationCode].error=`, error)
      })

      /**
    const transporter = nodemailer.createTransport({
    service: 'gmail', // o cualquier servicio de email
    auth: {
      user: '',
      pass: '',
    },
  });

  dbgConsoleLog(FILENAME, `[sendVerificationCode].Set mailOptions`)
  const mailOptions = {
    to: email,
    from: 'no-reply@my-band-app.com',
    subject: 'Código de verificación',
  //  text: `Tu código de verificación es: ${code}. Este código expirará en 10 minutos.`,
    text: `Tu código de verificación es: NNNNNNNN. Este código expirará en 10 minutos.`,
  };
  try {
    dbgConsoleLog(FILENAME, `[sendVerificationCode].sendMail.pre`)
    var sendMailResult = await transporter.sendMail(mailOptions);
    dbgConsoleLog(FILENAME, `[sendVerificationCode].sendMail.result=`, sendMailResult)
    resp.success = true
    resp.result = `Se envió el correo a ${email}`  
  } catch (error: any) {
    dbgConsoleLog(FILENAME, `[sendVerificationCode].sendMail.errorResult=`, error)
    console.error(error)
    resp.result = `ERROR_SEND_MAIL`  
  }
  */
  
  dbgConsoleLog(FILENAME, `[sendVerificationCode].result=`, resp)
  return resp
}