import express from 'express'
import * as usersServ from '../services/usersServ'
import {parsePlanType, parseStringFromRequest, parseDBObjectId, dbgConsoleLog, getStackFileName} from '../utils'
import { UserEntry } from '../types'

const FILENAME = getStackFileName()
const router = express.Router()
const cors = require('cors')
router.use(cors())
/*
router.options('/register', (_, res) => {
    resHeaderConfig(res)
    res.sendStatus(200)
})

router.options('/login', (_, res) => {
    resHeaderConfig(res)
    res.sendStatus(200)
})
*/
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
        const newUser = await usersServ.addNewUser(newUserEntry)
        dbgConsoleLog(FILENAME, `[POST]/register.addNewUser.post.result=`, newUser)
        if(newUser === false){
            throw new Error('No se agregar el nuevo user porque ya existe')
        }
        res.status(200).send('Usuario creado con exito')
    }catch (e: any) {
        res.status(400).send(e.message)
}
})

router.post('/login', async (req, res) => {
    //resHeaderConfig(res)
    try{
        const { email, password } = req.body
        const userDataRes = await usersServ.userLogin(email, password)
        if(userDataRes === false){
            res.status(400).send('Las credenciales no son validas')
        }else{
            res.json(userDataRes)
        }
    }catch(e: any){
        res.status(500).send('Internal server error')
    }
})

router.post('/updatePlan', async (req, res) => {
    //resHeaderConfig(res)
    try{
        const { userId, newPlan } = req.body
        const userDataRes = await usersServ.changePlan(parseDBObjectId(userId), parsePlanType(newPlan))
        if(userDataRes === false){
            throw new Error('No se pudo actualizar el plan')
        }else{
            res.json(userDataRes)
        }
    }catch(e: any){
        res.status(400).send(e.message)
    }
})

router.post('/changePass', async (req, res) => {
    //resHeaderConfig(res)
    try{
        const { email, password, newPass } = req.body
        const userDataRes = await usersServ.changePass(email, password, newPass)
        if(userDataRes === false){
            throw new Error('No se pudo cambiar la password')
        }else{
            res.send("Se actualizó la password con exito")
        }
    }catch(e: any){
        res.status(400).send(e.message)
    }
})

export default router