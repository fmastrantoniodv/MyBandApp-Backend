import express from 'express'
import * as projectsServ from '../services/projectsServ'
import { parseStringFromRequest, parseNumberFromRequest, parseChannelList, parseDBObjectId, dbgConsoleLog, getStackFileName, catchErrorResponse, setErrorResponse } from '../utils'

const FILENAME = getStackFileName()
const router = express.Router()
const cors = require('cors')
router.use(cors())

router.get('/:id', async (req, res) => {
    dbgConsoleLog(FILENAME, `[GET]/id=${req.params.id}.Init`)
    try {
        const projectId  = parseDBObjectId(req.params.id)
        dbgConsoleLog(FILENAME, `[GET]/id=${projectId}.getProjectById.pre`)
        const resProject = await projectsServ.getProjectById(projectId)
        dbgConsoleLog(FILENAME, `[GET]/id=${projectId}.getProjectById.post.result=`, resProject)
        if(!resProject.success){
            res.status(400)
            var message = `Hubo un error al obtener el proyecto de la db`
            if(resProject.result === 'PROJECT_NOT_FOUND'){
                message = `El id no corresponde a un proyecto`
            }
            setErrorResponse(res, resProject.result, message)
        }else{
            res.status(200).json(resProject.result)
        }
    } catch (e: any) {
        catchErrorResponse(res, e)
    }
})

router.post('/create', async (req, res) => {    
    dbgConsoleLog(FILENAME, `[POST]/create.REQ=`, req.body)
    try {
        const { userId, projectName } = req.body
        dbgConsoleLog(FILENAME, `[POST]/create.createNewProject.pre`)
        const projectCreated = await projectsServ.createNewProject(parseDBObjectId(userId), parseStringFromRequest(projectName, 1, 100))
        dbgConsoleLog(FILENAME, `[POST]/create.createNewProject.post.result=`, projectCreated)
        if(!projectCreated.success){
            res.status(400)
            var message = 'Hubo un error al crear proyecto en la db'
            setErrorResponse(res, projectCreated.result, message)
        }else{
            res.status(200).json(projectCreated.result)
        }
    } catch (e: any) {
        catchErrorResponse(res, e)
    }    
})

router.post('/save', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/save.REQ=`, req.body)
    try {
        const { projectId, userId, projectName, totalDuration, channelList } = req.body
        dbgConsoleLog(FILENAME, `[POST]/save.saveProject.pre`)
        const projectSaved = await projectsServ.saveProject(
            parseDBObjectId(projectId), 
            parseDBObjectId(userId), 
            parseStringFromRequest(projectName, 1, 100),
            parseNumberFromRequest(totalDuration, 0, 999999),
            parseChannelList(channelList)
            )
        dbgConsoleLog(FILENAME, `[POST]/save.saveProject.post.result=`, projectSaved)
        if(!projectSaved.success){
            res.status(400)
            var message = `Error al guardar el proyecto`
            if(projectSaved.result === 'PROJECT_NOT_FOUND'){
                message = 'No se encontro proyecto con ese ID'
            }
            setErrorResponse(res, projectSaved.result, message)
        }else{
            res.status(200).json(projectSaved.result)
        }
    } catch (e: any) {
        catchErrorResponse(res, e)
    }
})

router.post('/delete', async (req, res) => {
    dbgConsoleLog(FILENAME, `[POST]/delete.REQ=`, req.body)
    try {
        const { projectId, userId } = req.body
        const projectToDelete = {
            _id: parseDBObjectId(projectId), 
            userId: parseDBObjectId(userId)
        }
        dbgConsoleLog(FILENAME, `[POST]/delete.deleteProject.pre`)
        const deletedProject = await projectsServ.deleteProject(projectToDelete)
        dbgConsoleLog(FILENAME, `[POST]/delete.deleteProject.post`)
        if(!deletedProject.success){
            res.status(400)
            var message = 'Error al eliminar el proyecto'
            if(deletedProject.result === 'PROJECT_NOT_FOUND'){
                message = 'No se encontro proyecto con ese ID'
            }
            setErrorResponse(res, deletedProject.result , message)
        }else{
            res.status(200).send('Proyecto eliminado')
        }
    } catch (e: any) {
        catchErrorResponse(res, e)
    }
})

router.get('/getUserProjects/:id', async (req, res) => {
    dbgConsoleLog(FILENAME, `[GET]/getUserProjects/=${req.params.id}`)
    try {
        const userId = parseDBObjectId(req.params.id)
        dbgConsoleLog(FILENAME, `[GET]/getUserProjects.getUserProjects.pre`)
        const userProjects = await projectsServ.getUserProjects(userId)
        dbgConsoleLog(FILENAME, `[GET]/getUserProjects.getUserProjects.post`)
        if(!userProjects.success){
            res.status(400)
            var message = 'Error al obtener proyectos'
            if(userProjects.result === 'PROJECTS_NOT_FOUND'){
                message = 'No se encontro proyecto con ese user id'
            }
            setErrorResponse(res, userProjects.result , message)
        }else{
            res.status(200).json(userProjects.result)
        }
    } catch (e: any) {
        catchErrorResponse(res, e)
    }
})

export default router