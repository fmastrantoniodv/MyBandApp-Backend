import { Project, ProjectEntry } from '../interfaces'
import mongoose from 'mongoose'
const connectToDatabase = require('../mongo.js');
const ProjectModel = require('../models/Projects')

/*

export const getUserProjects = (userId: string): Array<ProjectInfo> => {
    const arrayUserProjects: Array<ProjectInfo> = []
    projects.map(project => {
        if(project.userId === userId){
            arrayUserProjects.push(project)
            }
            })
            return arrayUserProjects
            }
            */
           
export const getProject = async (id: string): Promise<Project> => {
    console.log(`${new Date()}.[projectsServ].[getProject].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[getProject].[MSG].id=${id}`)
    console.log(`${new Date()}.[projectsServ].[getProject].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[projectsServ].[getProject].[MSG].connectDB.post`)
    return await ProjectModel.find({ _id: id }).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[projectsServ].[getProject].[MSG].ProjectModel.result=`,result[0])
        return result[0]
    }).catch((err: any) => {
        console.error(`${new Date()}.[projectsServ].[getProject].[ERR].ProjectModel.Find.catch`,err)
        return err
    })
}


const addProjectToDB = async (newProjectEntry: ProjectEntry): Promise<Project>  => {
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].connectDB.post`)
    const projectToDB = new ProjectModel(newProjectEntry)
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].ProjectModel.save.pre`)
    return await projectToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].ProjectModel.save.res=`, res)
        mongoose.connection.close()
        return res
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}

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
