import express from 'express'
import * as usersServ from '../services/usersServ'
import {parsePlanType, parseStringFromRequest, parseDBObjectId, dbgConsoleLog, getStackFileName, catchErrorResponse, setErrorResponse} from '../utils'
import { UserEntry } from '../types'
import * as mailSenderServ from '../services/mailSenderServ'

const FILENAME = getStackFileName()
const router = express.Router()
const cors = require('cors')
router.use(cors())

router.post('/register', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/register.REQ=`, req.body)
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

router.post('/sendCodeToMail', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/sendCodeToMail.REQ=`, req.body)
    try{
        const { email } = req.body
        dbgConsoleLog(FILENAME, `[POST]/sendCodeToMail.sendVerificationCode.pre`)
        const sendMailRes = await mailSenderServ.sendVerificationCode(
            parseStringFromRequest(email, 5, 150)
        )
        dbgConsoleLog(FILENAME, `[POST]/sendCodeToMail.sendVerificationCode.post.result=`, sendMailRes)
        if(!sendMailRes.success){
            res.status(400)
            var message = 'Error al enviar mail' //Default
            if(sendMailRes.result === 'INVALID_MAIL'){
                message = 'El mail no está registrado'
            }
            setErrorResponse(res, sendMailRes.result , message)
        }else{
            res.status(200).send("Se envió el código al mail")
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})

router.get('/getUserFavsList/:id', async (req, res) => {
    dbgConsoleLog(FILENAME, `[GET]/getUserFavsList.REQ=`, req.params)
    try{
        const userId = req.params.id
        dbgConsoleLog(FILENAME, `[GET]/getUserFavsList.pre`)
        const userDataRes = await usersServ.getUserFavList(parseDBObjectId(userId))
        if(!userDataRes.success){
            res.status(400)
            var message = 'Hubo un error al intentar obtener los favoritos del usuario en la db' //Default
            if(userDataRes.result === 'USR_NOT_FOUND'){
                message = 'No se encontro usuario con ese id'
            }
            setErrorResponse(res, userDataRes.result , message)
        }else{
            res.status(200).json(userDataRes.result)
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})

router.post('/updateFav', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/updateFav.REQ=`, req.body)
    try{
        const { userId, sampleId, actionCode } = req.body
        dbgConsoleLog(FILENAME, `[POST]/updateFav.pre`)
        const userDataRes = await usersServ.updateFav(parseDBObjectId(userId), parseDBObjectId(sampleId), parseStringFromRequest(actionCode, 3, 5))
        dbgConsoleLog(FILENAME, `[POST]/updateFav.post.result`, userDataRes)
        if(!userDataRes.success){
            res.status(400)
            var message = 'Hubo un error al intentar actualizar favs del usuario en la db' //Default
            if(userDataRes.result === 'ACTION_CODE_INVALID'){
                message = 'El actionCode es invalido, debe ser FAV o UNFAV'
            }
            setErrorResponse(res, userDataRes.result, message)
        }else{
            res.status(200).send(userDataRes.result)
        }
    }catch(e: any){
        catchErrorResponse(res, e)
    }
})


export default router