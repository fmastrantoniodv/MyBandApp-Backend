import express from 'express'
import * as favouritesSamplesServ from '../services/favouritesSamplesServ'
import envParams from '../envParams.json'
import { SampleFav } from '../types'
import {parseStringFromRequest, parseUserId} from '../utils'

const router = express.Router()
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
    const { userId, sampleId, sampleName } = req.body
    parseUserId(userId)
    const newFavEntry: SampleFav = {
        sampleId: parseStringFromRequest(sampleId),
        sampleName: parseStringFromRequest(sampleName)
    }
    const newFav = favouritesSamplesServ.addNewFav(
        userId,
        newFavEntry 
    )

    res.json(newFav)
}catch (e: any) {
    res.status(400).send(e.message)
}


})

export default router