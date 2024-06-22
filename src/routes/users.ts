import express from 'express'
import * as usersServ from '../services/usersServ'
import {parsePlanType, parseStringFromRequest, parseDBObjectId, dbgConsoleLog, getStackFileName, catchErrorResponse, setErrorResponse} from '../utils'
import { UserEntry } from '../types'

const FILENAME = getStackFileName()
const router = express.Router()
const cors = require('cors')
router.use(cors())

router.post('/register', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/register.REQ=`, req.body)
    //resHeaderConfig(res)
    try{
        const { email, usrName, password, plan } = req.body
        const newUserEntry: UserEntry = {
            usrName: parseStringFromRequest(usrName, 1, 30),
            password: parseStringFromRequest(password, 8, 250),
            email: parseStringFromRequest(email, 1,100),
            plan: parsePlanType(plan)
        }
        dbgConsoleLog(FILENAME, `[POST]/register.addNewUser.pre`)
        const resNewUser = await usersServ.addNewUser(newUserEntry)
        dbgConsoleLog(FILENAME, `[POST]/register.addNewUser.post.result=`, resNewUser)
        if(!resNewUser.success){
            res.status(400)
            var message = 'Hubo un error al intentar guardar usuario en la db' //Default
            if(resNewUser.result === 'USR_EXIST'){
                message = 'Usuario no agregado. Ya existe un usuario con ese username'
            }
            setErrorResponse(res, resNewUser.result, message)
        }else{
            res.status(200).json(resNewUser.result)
        }
    }catch (e: any) {
        catchErrorResponse(res, e)
}
})

router.post('/login', async (req, res) => {
    //resHeaderConfig(res)
    dbgConsoleLog(FILENAME, `[POST]/login.REQ=`, req.body)
    try{
        const { email, password } = req.body
        dbgConsoleLog(FILENAME, `[POST]/login.userLogin.pre`)
        const userDataRes = await usersServ.userLogin(
            parseStringFromRequest(email, 5, 150),
            parseStringFromRequest(password, 8, 250)
        )
        if(!userDataRes.success){
            res.status(400)
            var message = 'Hubo un error al intentar guardar usuario en la db' //Default
            if(userDataRes.result === 'INVALID_MAIL_PASSWORD'){
                message = 'Las credenciales no son validas'
            }
            setErrorResponse(res, userDataRes.result, message)
        }else{
            res.status(200).json(userDataRes.result)
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})

router.post('/updatePlan', async (req, res) => {
    //resHeaderConfig(res)
    dbgConsoleLog(FILENAME, `[POST]/updatePlan.REQ=`, req.body)
    try{
        const { userId, newPlan } = req.body
        dbgConsoleLog(FILENAME, `[POST]/updatePlan.changePlan.pre`)
        const userDataRes = await usersServ.changePlan(parseDBObjectId(userId), parsePlanType(newPlan))
        dbgConsoleLog(FILENAME, `[POST]/updatePlan.changePlan.post.result`, userDataRes)
        if(!userDataRes.success){
            res.status(400)
            var message = 'Hubo un error al intentar guardar usuario en la db' //Default
            if(userDataRes.result === 'INVALID_MAIL_PASSWORD'){
                message = 'Las credenciales no son validas'
            }
            setErrorResponse(res, userDataRes.result, message)
        }else{
            res.status(200).json(userDataRes.result)
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})

router.post('/changePass', async (req, res) => {
    //resHeaderConfig(res)
    dbgConsoleLog(FILENAME, `[POST]/changePass.REQ=`, req.body)
    try{
        const { email, password, newPass } = req.body
        dbgConsoleLog(FILENAME, `[POST]/updatePlan.changePass.pre`)
        const userDataRes = await usersServ.changePass(
            parseStringFromRequest(email, 5, 150), 
            parseStringFromRequest(password, 8, 250), 
            parseStringFromRequest(newPass, 8, 150)
        )
        dbgConsoleLog(FILENAME, `[POST]/updatePlan.changePass.post.result=`, userDataRes)
        if(!userDataRes.success){
            res.status(400)
            var message = 'Hubo un error al intentar cambiar password del usuario en la db' //Default
            if(userDataRes.result === 'INVALID_MAIL_PASSWORD'){
                message = 'Las credenciales son inválidas'
            }
            setErrorResponse(res, userDataRes.result , message)
        }else{
            res.status(200).send("Se actualizó la password con exito")
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})

export default router