import express from 'express'
import * as usersServ from '../services/usersServ'
import envParams from '../envParams.json'
import { UserEntry } from '../types'
import {parsePlanType, parseStringFromRequest} from '../utils'

const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

const resHeaderConfig = (res: any, endpoint: string) => {
    res.header("Access-Control-Allow-Origin", endpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
}

router.post('/register', (req, res) => {
    resHeaderConfig(res, frontendEndpoint)
    try{
        const { email, usrName, password, plan } = req.body
        const newUserEntry: UserEntry = {
            usrName: parseStringFromRequest(usrName),
            password: parseStringFromRequest(password),
            email: parseStringFromRequest(email),
            plan: parsePlanType(plan)
        }
        const newUser = usersServ.addNewUser(newUserEntry)
        if(newUser === false){
            throw new Error('No se agregar el nuevo user porque ya existe')
        }
        res.json(newUser)
    }catch (e: any) {
        res.status(400).send(e.message)
}
})
/*
router.delete('/', (req, res) => {
    try{
        const { userId, sampleId } = req.body
        parseUserId(userId)
        parseStringFromRequest(sampleId)
        if(!favouritesSamplesServ.deleteFav(userId, sampleId)){
            throw new Error('No se pudo borrar')
        }
        res.send("ok!")
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})
*/
export default router