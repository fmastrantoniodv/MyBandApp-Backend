import express from 'express'
import * as project from '../services/projectsServ'
import envParams from '../envParams.json'
//import { EqParams, ChannelConfig, SoundListItem, States } from '../types'

const router = express.Router()
const frontendEndpoint: string = envParams.dev['front-endpoint-access-control'] as string

router.get('/:id', (req, res) => {
    console.log('request project')
    const resProject = project.getProject(req.params.id)
    res.header("Access-Control-Allow-Origin", frontendEndpoint)
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    res.send(resProject)
})

router.post('/', (_req, res) => {
    //const { EqParams, ChannelConfig, SoundListItem, States } = req.body
    res.send('Saving a project')
})

export default router