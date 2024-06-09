import express from 'express'
import * as projectsServ from '../services/projectsServ'
import { resHeaderConfig, parseStringFromRequest } from '../utils'
const router = express.Router()

router.get('/:id', async (req, res) => {
    resHeaderConfig(res)
    const projectId  = req.params.id
    console.log(`method=get, param=Id=${projectId}`)
    const resProject = await projectsServ.getProject(projectId)
    res.json(resProject)
})

router.post('/create', async (req, res) => {
    resHeaderConfig(res)
    const { userId, projectName, channelList } = req.body
    console.log(`/create.req=(userId=${userId}, projectName=${projectName}, channelList=${channelList}`)
    const projectCreated = await projectsServ.createNewProject(parseStringFromRequest(userId, 1, 100), parseStringFromRequest(projectName, 1, 100))
    res.json(projectCreated)
})

export default router