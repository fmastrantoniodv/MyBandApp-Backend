import { Project, ProjectEntry, ProjectSave, ServResponse } from '../interfaces'
import { SoundListItem } from '../types';
import { addProjectToDB, saveProjectToDB, deleteProjectDB, getProjectByIdFromDB } from '../db/projectsDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils';

const FILENAME = getStackFileName()

export const createNewProject = async (userId: string, projectName: string): Promise<Project> => {
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].input params:userId=${userId}, projectName=${projectName}`)
    var createdDate = new Date()
    var newProjectEntry: ProjectEntry = {
        userId: userId,
        projectName: projectName,
        createdDate: createdDate,
        savedDate: createdDate,
        totalDuration: 0
    }
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.pre`)
    const projectData = await addProjectToDB(newProjectEntry)
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.post`)
    dbgConsoleLog(FILENAME, `[createNewProject].[MSG].addProjectToDB.projectData=`, projectData)
    return projectData
}

export const saveProject = async (projectId: string, userId: string, projectName: string, totalDuration: number, channelList: Array<SoundListItem>): Promise<ServResponse> => {
    const resp: ServResponse = { success: false}
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].input params:userId=${userId}, projectName=${projectName}`)
    var savedDate = new Date()
    var updatedProject: ProjectSave = {
        projectId: projectId,
        userId: userId,
        projectName: projectName,
        savedDate: savedDate,
        totalDuration: totalDuration,
        channelList: channelList
    }
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.pre`)
    const projectData = await saveProjectToDB(updatedProject)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.post`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.projectData=`, projectData)
    if(projectData.success === true && projectData.result !== null){
        resp.success = true
        resp.result = projectData.result
    }else{
        resp.success = false
        if(projectData.result === null){
            resp.result = "No se encontró proyecto con ese id"
        }else{
            resp.result = projectData.result
        }
    }
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.res=`, resp)
    return resp

}

export const deleteProject = async (projectToDelete: Object): Promise<boolean> => {
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[deleteProject].[MSG].input params:projectToDelete=${projectToDelete}`)
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
    const projectFromDB = await getProjectByIdFromDB(projectId)
    if(projectFromDB.success && projectFromDB.result !== null){
        resp.success = true
        resp.result = projectFromDB.result
    }else{
        resp.success = false
        resp.result = projectFromDB.result
    }
    dbgConsoleLog(FILENAME, `[getProjectById].[MSG].getProjectByIdFromDB.post.result=`, projectFromDB)
    return resp
}
