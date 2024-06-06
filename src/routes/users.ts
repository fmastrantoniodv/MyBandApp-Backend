import express from 'express'
import * as usersServ from '../services/usersServ'
import envParams from '../envParams.json'
import {parsePlanType, parseStringFromRequest, resHeaderConfig} from '../utils'
import { UserEntry } from '../types'

const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

router.post('/register', async (req, res) => {
    resHeaderConfig(res, frontendEndpoint)
    try{
        const { email, usrName, password, plan } = req.body
        const newUserEntry: UserEntry = {
            usrName: parseStringFromRequest(usrName, 1, 30),
            password: parseStringFromRequest(password, 8, 250),
            email: parseStringFromRequest(email, 1,100),
            plan: parsePlanType(plan)
        }
        const newUser = await usersServ.addNewUser(newUserEntry)
        if(newUser === false){
            throw new Error('No se agregar el nuevo user porque ya existe')
        }
        res.send('Usuario creado con exito')
    }catch (e: any) {
        res.status(400).send(e.message)
}
})

router.post('/login', async (req, res) => {
    resHeaderConfig(res, frontendEndpoint)
    try{
        const { email, password } = req.body
        const userDataRes = await usersServ.userLogin(email, password)
        if(userDataRes === false){
            throw new Error('Las credenciales no son validas')
        }else{
            res.json(userDataRes)
        }
    }catch(e: any){
        res.status(400).send(e.message)
    }
})

router.post('/updatePlan', async (req, res) => {
    resHeaderConfig(res, frontendEndpoint)
    try{
        const { userId, newPlan } = req.body
        const userDataRes = await usersServ.changePlan(userId, newPlan)
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
    resHeaderConfig(res, frontendEndpoint)
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