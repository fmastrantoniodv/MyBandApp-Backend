import express from 'express'
import * as favouritesSamplesServ from '../services/favouritesSamplesServ'
import envParams from '../envParams.json'
import { Sample } from '../types'
import {parseStringFromRequest, parseNumberFromRequest, parseDBObjectId} from '../utils'

const router = express.Router()
const cors = require('cors')
router.use(cors())
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

router.get('/', (_req, res) => {
    console.log('request favs')
    const resFavouritesList = favouritesSamplesServ.getFavouritesList()
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(resFavouritesList)
})

router.post('/', (req, res) => {
try{
    const { userId, sampleId, sampleName, collectionCode, duration, tempo } = req.body
    parseDBObjectId(userId)
    const newFavEntry: Sample = {
        sampleId: parseDBObjectId(sampleId),
        sampleName: parseStringFromRequest(sampleName, 1, 100),
        collectionCode: parseStringFromRequest(collectionCode, 1, 100),
        duration: parseNumberFromRequest(duration, 0, 600000),
        tempo: parseNumberFromRequest(tempo, 0, 999)
    }
    const newFav = favouritesSamplesServ.addNewFav(
        userId,
        newFavEntry 
    )
    if(newFav === false){
        throw new Error('No se agregar el nuevo fav porque ya existe')
    }
    res.json(newFav)
}catch (e: any) {
    res.status(400).send(e.message)
}
})

router.delete('/', (req, res) => {
    try{
        const { userId, sampleId } = req.body
        parseDBObjectId(userId)
        parseStringFromRequest(sampleId, 1,100)
        if(!favouritesSamplesServ.deleteFav(userId, sampleId)){
            throw new Error('No se pudo borrar')
        }
        res.send("ok!")
    }catch (e: any) {
        res.status(400).send(e.message)
    }
})

export default router