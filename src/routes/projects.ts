import express from 'express'
import * as projectsServ from '../services/projectsServ'
import { resHeaderConfig, parseStringFromRequest, parseNumberFromRequest, parseChannelList, parseDBObjectId } from '../utils'
const router = express.Router()
/*
router.get('/:id', async (req, res) => {
    resHeaderConfig(res)
    const projectId  = req.params.id
    console.log(`method=get, param=Id=${projectId}`)
    const resProject = await projectsServ.getProject(projectId)
    res.json(resProject)
})
*/
router.post('/create', async (req, res) => {
    resHeaderConfig(res)
    const { userId, projectName, channelList } = req.body
    console.log(`/create.req=(userId=${userId}, projectName=${projectName}, channelList=${channelList}`)
    const projectCreated = await projectsServ.createNewProject(parseDBObjectId(userId), parseStringFromRequest(projectName, 1, 100))
    res.json(projectCreated)
})

router.post('/save', async (req, res) => {
    const { projectId, userId, projectName, totalDuration, channelList } = req.body
    resHeaderConfig(res)
    console.log(`[projects].[post /save].req:projectId=${projectId}, userId=${userId}, projectName=${projectName}, totalDuration=${totalDuration}, channelList=${channelList}`)
    const projectSaved = await projectsServ.saveProject(
        parseDBObjectId(projectId), 
        parseDBObjectId(userId), 
        parseStringFromRequest(projectName, 1, 100),
        parseNumberFromRequest(totalDuration, 1, 999999),
        parseChannelList(channelList)
        )    
    if(projectSaved === false){
        res.status(400).send('Error al guardar el proyecto')
    }
    res.json(projectSaved)
})

router.post('/delete', async (req, res) => {
    const { projectId, userId } = req.body
    resHeaderConfig(res)
    console.log(`[projects].[post /save].req:projectId=${projectId}, userId=${userId}`)
    const projectToDelete = {
        _id: parseDBObjectId(projectId), 
        userId: parseDBObjectId(userId)
    }
    const deletedProject = await projectsServ.deleteProject(projectToDelete)
    if(deletedProject === false){
        res.status(400).send('Error al eliminar el proyecto')
    }
    res.send('Proyecto eliminado')
})

export default router