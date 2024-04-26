import express from 'express'
import * as favouritesSamplesServ from '../services/favouritesSamplesServ'
import envParams from '../envParams.json'

const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

router.get('/', (_req, res) => {
    console.log('request favs')
    const resFavouritesList = favouritesSamplesServ.getFavouritesList()
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(resFavouritesList)
})

router.post('/', (_req, res) => {
    //const { EqParams, ChannelConfig, SoundListItem, States } = req.body
    res.send('Saving a project')
})

export default router