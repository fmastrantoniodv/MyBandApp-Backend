import { saveVerifyCodeDB } from '../db/usersDBManager';
import { ServResponse } from '../interfaces';
import { dbgConsoleLog, getStackFileName } from '../utils'
const FILENAME = getStackFileName()
const nodemailer = require('nodemailer');

export const sendVerificationCode = async (email: string): Promise<ServResponse> =>{
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[sendVerificationCode].Init`)
    dbgConsoleLog(FILENAME, `[sendVerificationCode].saveVerifyCodeDB.pre`)
    var createAndSaveVerifyCode = await saveVerifyCodeDB(email)
    dbgConsoleLog(FILENAME, `[sendVerificationCode].saveVerifyCodeDB.result=`, createAndSaveVerifyCode)
    dbgConsoleLog(FILENAME, `[sendVerificationCode].Create transport`)
    const transporter = nodemailer.createTransport({
    service: 'gmail', // o cualquier servicio de email
    auth: {
      user: 'mybandapp.arg@gmail.com',
      pass: 'mbp271024FGM',
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
  
  dbgConsoleLog(FILENAME, `[sendVerificationCode].result=`, resp)
  return resp
}