import express from 'express'
import * as project from '../services/projectsServ'
//import { EqParams, ChannelConfig, SoundListItem, States } from '../types'

const router = express.Router()

router.get('/:id', (req, res) => {
    console.log('request project')
    const resProject = project.getProject(+req.params.id)
    res.send(resProject)
    console.log(res)
})

router.post('/', (_req, res) => {
    //const { EqParams, ChannelConfig, SoundListItem, States } = req.body
    res.send('Saving a project')
})

export default router