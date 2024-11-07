import { saveVerifyCodeDB } from '../db/usersDBManager';
import { DBResponse, ServResponse } from '../interfaces';
import { dbgConsoleLog, errorConsoleLog, getStackFileName } from '../utils'
const FILENAME = getStackFileName()
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
      errorConsoleLog(FILENAME, `[sendVerificationCode].error=${createAndSaveVerifyCode.result}`)
      resp.result = createAndSaveVerifyCode.result
      return resp
    } 
    const msg = {
      to: email, 
      from: 'franco.mastrantonio@davinci.edu.ar',
      subject: 'MyBanddApp - Código de verificación',
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
  dbgConsoleLog(FILENAME, `[sendVerificationCode].result=`, resp)
  return resp
}