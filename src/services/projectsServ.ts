import { Project, ProjectEntry, ProjectSave } from '../interfaces'
import { SoundListItem } from '../types';
import { addProjectToDB, saveProjectToDB, deleteProjectDB } from './db/projectsDBManager'

export const createNewProject = async (userId: string, projectName: string): Promise<Project> => {
    console.log(`${new Date()}.[projectsServ].[createNewProject].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[createNewProject].[MSG].input params:userId=${userId}, projectName=${projectName}`)
    var createdDate = new Date()
    var newProjectEntry: ProjectEntry = {
        userId: userId,
        projectName: projectName,
        createdDate: createdDate,
        savedDate: createdDate,
        totalDuration: 0
    }
    console.log(`${new Date()}.[projectsServ].[createNewProject].[MSG].addProjectToDB.pre`)
    const projectData = await addProjectToDB(newProjectEntry)
    console.log(`${new Date()}.[projectsServ].[createNewProject].[MSG].addProjectToDB.post`)
    console.log(`${new Date()}.[projectsServ].[createNewProject].[MSG].addProjectToDB.projectData=`, projectData)
    return projectData
}

export const saveProject = async (projectId: string, userId: string, projectName: string, totalDuration: number, channelList: Array<SoundListItem>): Promise<Project | boolean> => {
    console.log(`${new Date()}.[projectsServ].[saveProject].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[saveProject].[MSG].input params:userId=${userId}, projectName=${projectName}`)
    var savedDate = new Date()
    var updatedProject: ProjectSave = {
        projectId: projectId,
        userId: userId,
        projectName: projectName,
        savedDate: savedDate,
        totalDuration: totalDuration,
        channelList: channelList
    }
    console.log(`${new Date()}.[projectsServ].[saveProject].[MSG].saveProjectToDB.pre`)
    const projectData = await saveProjectToDB(updatedProject)
    if(projectData === undefined){
        return false
    }

    console.log(`${new Date()}.[projectsServ].[saveProject].[MSG].saveProjectToDB.post`)
    console.log(`${new Date()}.[projectsServ].[saveProject].[MSG].saveProjectToDB.projectData=`, projectData)
    return projectData
}

export const deleteProject = async (projectToDelete: Object): Promise<boolean> => {
    console.log(`${new Date()}.[projectsServ].[deleteProject].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[deleteProject].[MSG].input params:projectToDelete=${projectToDelete}`)
    console.log(`${new Date()}.[projectsServ].[deleteProject].[MSG].deleteProjectDB.pre`)
    const success = await deleteProjectDB(projectToDelete)
    console.log(`${new Date()}.[projectsServ].[deleteProject].[MSG].deleteProjectDB.post`)
    console.log(`${new Date()}.[projectsServ].[deleteProject].[MSG].deleteProjectDB.success=`, success)
    return success
}


