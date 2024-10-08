import { ProjectEntry, ProjectSave, ServResponse, DBResponse } from '../interfaces'
import { SoundListItem } from '../types';
import { addProjectToDB, saveProjectToDB, deleteProjectDB, getProjectByIdFromDB, getUserProjectsFromDB } from '../db/projectsDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils';

const tempoDefault = 110
const FILENAME = getStackFileName()

export const createNewProject = async (userId: string, projectName: string): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].input params:userId=${userId}, projectName=${projectName}`)
    var createdDate = new Date()
    var newProjectEntry: ProjectEntry = {
        userId: userId,
        projectName: projectName,
        createdDate: createdDate,
        savedDate: createdDate,
        totalDuration: 0,
        tempo: tempoDefault
    }
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.pre`)
    const projectData = await addProjectToDB(newProjectEntry)
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.post.result=`, projectData)
    if(projectData.success){
        dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.post.result=`, projectData.result)
        resp.success = true
    }
    resp.result = projectData.result
    return projectData
}

export const saveProject = async (projectId: string, userId: string, projectName: string, totalDuration: number, channelList: Array<SoundListItem>, tempo: number): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].input params:projectId=${projectId}, userId=${userId}, projectName=${projectName}, totalDuration=${totalDuration}, channelList=${channelList}`)
    channelList.map(value => dbgConsoleLog(FILENAME, `[saveProject].[MSG].channelListItem`, value))
    var savedDate = new Date()
    var projectData
    if(projectId === undefined){
        var newProject: ProjectEntry = {
            userId: userId,
            projectName: projectName,
            createdDate:savedDate,
            savedDate: savedDate,
            totalDuration: totalDuration,
            tempo: tempo,
            channelList: channelList
        }
        projectData = await addProjectToDB(newProject)
    }else{
        var updatedProject: ProjectSave = {
            projectId: projectId,
            userId: userId,
            projectName: projectName,
            savedDate: savedDate,
            totalDuration: totalDuration,
            tempo: tempo,
            channelList: channelList
        }
        projectData = await saveProjectToDB(updatedProject)
    }
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.pre`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.post`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.projectData=`, projectData)
    if(projectData.success === true && projectData.result !== null){
        resp.success = true
        resp.result = projectData.result
    }else{
        if(projectData.result === 'PROJECT_NOT_FOUND'){
            resp.result = "No se encontró proyecto con ese id"
        }else{
            resp.result = projectData.result
        }
    }
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.res=`, resp)
    return resp

}

export const deleteProject = async (projectToDelete: Object): Promise<ServResponse> => {
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].input params:projectToDelete=`, projectToDelete)
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].deleteProjectDB.pre`)
    const success = await deleteProjectDB(projectToDelete)
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].deleteProjectDB.post`)
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].deleteProjectDB.success=`, success)
    return success
}

export const getProjectById = async (projectId: string): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[getProjectById].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[getProjectById].[MSG].input params:projectId=${projectId}`)
    dbgConsoleLog(FILENAME, `[getProjectById].[MSG].getProjectByIdFromDB.pre`)
    const projectFromDB: DBResponse = await getProjectByIdFromDB(projectId)
    if(projectFromDB.success && projectFromDB.result !== null && projectFromDB.result !== undefined ){
        //Set respuesta que se pudo agregar el usuario
        dbgConsoleLog(FILENAME, `[getProjectById].[MSG].Resp=Proyecto obtenido de la db`)
        var projectInfo: any = projectFromDB.result
        var channelListInfo: any = projectInfo['channelList']
        dbgConsoleLog(FILENAME, `[getProjectById].[MSG].projectFromDB.projectInfo=`,projectInfo)
        dbgConsoleLog(FILENAME, `[getProjectById].[MSG].projectFromDB.channelListInfo`,channelListInfo)
        var channelList: Array<Object> = []
        try {
            channelListInfo.map((channel: any) => {
                channelList.push({            
                    channelConfig: channel.channelConfig,
                    collectionCode: channel.sampleId['collectionCode'],
                    duration: channel.sampleId['duration'],
                    id: channel.sampleId['id'],
                    sampleName: channel.sampleId['sampleName'],
                    tempo: channel.sampleId['tempo']
                })
            })
            
        } catch (error: any) {
            resp.result = 'PARSE_DATA_ERROR'
            resp.success = false
            return resp
        }
        dbgConsoleLog(FILENAME, `[getProjectById].[MSG].projectFromDB.channelList`,channelList)
            
        var ejemplo = {
            ...projectInfo.toJSON(),
            channelList: channelList
        }
        resp.result = ejemplo
        resp.success = true
        dbgConsoleLog(FILENAME, `[getProjectById].[MSG].projectFromDB.resp=`,resp)
    }else{
        resp.result = projectFromDB.result
    }
    dbgConsoleLog(FILENAME, `[getProjectById].[MSG].getProjectByIdFromDB.post.result=`, projectFromDB)
    return resp
}

export const getUserProjects = async (userId: string): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[getUserProjects].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[getUserProjects].[MSG].input params:userId=${userId}`)
    dbgConsoleLog(FILENAME, `[getUserProjects].[MSG].getProjectByIdFromDB.pre`)
    const projectFromDB = await getUserProjectsFromDB(userId)
    if(projectFromDB.success && projectFromDB.result !== null){
        //Set respuesta que se pudo agregar el usuario
        dbgConsoleLog(FILENAME, `[getUserProjects].[MSG].Resp=Proyecto/s obtenido de la db`)
        resp.success = true
    }
    resp.result = projectFromDB.result
    dbgConsoleLog(FILENAME, `[getUserProjects].[MSG].getProjectByIdFromDB.post.result=`, projectFromDB)
    return resp
}