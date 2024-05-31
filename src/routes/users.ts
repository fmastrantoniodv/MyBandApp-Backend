import express from 'express'
import * as usersServ from '../services/usersServ'
import envParams from '../envParams.json'
import {parsePlanType, parseStringFromRequest} from '../utils'
import { UserEntry } from '../types'
//import { UserData } from '../interfaces'
/*
import { User, UserEntry } from '../types'
import { getUserProjects } from '../services/projectsServ'
import { getUserFavs } from '../services/favouritesSamplesServ'
*/
const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

const resHeaderConfig = (res: any, endpoint: string) => {
    res.header("Access-Control-Allow-Origin", endpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
}

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
            /*
            res.json({
                userData,
                userProjects: getUserProjects(userData.userId),
                userFavs: getUserFavs(userData.userId)
            })
            */
        }
    }catch(e: any){
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