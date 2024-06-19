import express from 'express'
import * as projectsServ from '../services/projectsServ'
import { parseStringFromRequest, parseNumberFromRequest, parseChannelList, parseDBObjectId, dbgConsoleLog, getStackFileName } from '../utils'
const router = express.Router()
const FILENAME = getStackFileName()
const cors = require('cors')
router.use(cors())

router.get('/:id', async (req, res) => {
    try {
        //resHeaderConfig(res)
        dbgConsoleLog(FILENAME, `[GET]/id=${req.params.id}.Init`)
        dbgConsoleLog(FILENAME, `[GET]/id=${req.params.id}.Headers=`,res.getHeaders())
        const projectId  = parseDBObjectId(req.params.id)
        dbgConsoleLog(FILENAME, `[GET]/id=${projectId}.getProjectById.pre`)
        const resProject = await projectsServ.getProjectById(projectId)
        dbgConsoleLog(FILENAME, `[GET]/id=${projectId}.getProjectById.post.result=`, resProject)
        if(resProject.success){
            res.status(200).json(resProject.result)
        }else{
            res.status(400).send(`El id no corresponde a un proyecto`)
        }
    } catch (e: any) {
        res.status(400).send(e.message)
    }
})

router.post('/create', async (req, res) => {
    //resHeaderConfig(res)
    const { userId, projectName, channelList } = req.body
    console.log(`/create.req=(userId=${userId}, projectName=${projectName}, channelList=${channelList}`)
    const projectCreated = await projectsServ.createNewProject(parseDBObjectId(userId), parseStringFromRequest(projectName, 1, 100))
    res.json(projectCreated)
})

router.post('/save', async (req, res) => {
    const { projectId, userId, projectName, totalDuration, channelList } = req.body
    //resHeaderConfig(res)
    console.log(`[projects].[post /save].req:projectId=${projectId}, userId=${userId}, projectName=${projectName}, totalDuration=${totalDuration}, channelList=${channelList}`)
    const projectSaved = await projectsServ.saveProject(
        parseDBObjectId(projectId), 
        parseDBObjectId(userId), 
        parseStringFromRequest(projectName, 1, 100),
        parseNumberFromRequest(totalDuration, 1, 999999),
        parseChannelList(channelList)
        )    
    if(projectSaved.success === false){
        res.status(400).send(`Error al guardar el proyecto: ${projectSaved.result}`)
    }else{
        res.json(projectSaved.result)
    }
})

router.post('/delete', async (req, res) => {
    const { projectId, userId } = req.body
    //resHeaderConfig(res)
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