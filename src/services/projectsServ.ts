import { Project, ProjectEntry, ProjectSave } from '../interfaces'
import { SoundListItem } from '../types';
import { addProjectToDB, saveProjectToDB, deleteProjectDB } from '../db/projectsDBManager'
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

export const saveProject = async (projectId: string, userId: string, projectName: string, totalDuration: number, channelList: Array<SoundListItem>): Promise<Project | boolean> => {
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
    if(projectData === undefined){
        return false
    }

    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.post`)
    dbgConsoleLog(FILENAME, `[saveProject].[MSG].saveProjectToDB.projectData=`, projectData)
    return projectData
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


