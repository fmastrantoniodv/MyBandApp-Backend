import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const ProjectModel = require('../../models/Projects')
import { Project, ProjectEntry, ProjectSave} from '../../interfaces'

export const saveProjectToDB = async (updatedProjectData: ProjectSave): Promise<Project>  => {
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].Init`)
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[projectsServ].[addProjectToDB].[MSG].connectDB.post`)
    const projectToDB = new ProjectModel(updatedProjectData)
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

export const addProjectToDB = async (newProjectEntry: ProjectEntry): Promise<Project>  => {
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

export const getProjectFromDB = async (id: string): Promise<Project> => {
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

export const deleteProjectDB = async (projectToDelete: Object): Promise<boolean>  => {
    console.log(`${new Date()}.[dbmanager].[deleteProjectDB].[MSG].Init`)
    console.log(`${new Date()}.[dbmanager].[deleteProjectDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[dbmanager].[deleteProjectDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[dbmanager].[deleteProjectDB].[MSG].ProjectModel.findOneAndDelete.pre`)
    return await ProjectModel.findOneAndDelete(projectToDelete).then((res: any)=>{
        console.log(`${new Date()}.[dbmanager].[deleteProjectDB].[MSG].ProjectModel.findOneAndDelete.res=`, res)
        mongoose.connection.close()
        return true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[dbmanager].[deleteProjectDB].[ERR].findOneAndDelete.Error=`, err.message)
        return false
    })
}