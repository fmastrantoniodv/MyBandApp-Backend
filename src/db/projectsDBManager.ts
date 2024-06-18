import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const ProjectModel = require('../models/Projects')
import { Project, ProjectEntry, ProjectSave} from '../interfaces'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const saveProjectToDB = async (updatedProjectData: ProjectSave): Promise<Project>  => {
    dbgConsoleLog(FILENAME, `[addProjectToDB].Init`)
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.post`)
    const projectToDB = new ProjectModel(updatedProjectData)
    dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.pre`)
    return await projectToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.res=`, res)
        mongoose.connection.close()
        return res
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}

export const addProjectToDB = async (newProjectEntry: ProjectEntry): Promise<Project>  => {
    dbgConsoleLog(FILENAME, `[addProjectToDB].Init`)
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.post`)
    const projectToDB = new ProjectModel(newProjectEntry)
    dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.pre`)
    return await projectToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.res=`, res)
        mongoose.connection.close()
        return res
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}

export const getProjectFromDB = async (id: string): Promise<Project> => {
    dbgConsoleLog(FILENAME, `[getProject].Init`)
    dbgConsoleLog(FILENAME, `[getProject].id=${id}`)
    dbgConsoleLog(FILENAME, `[getProject].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getProject].connectDB.post`)
    return await ProjectModel.find({ _id: id }).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getProject].ProjectModel.result=`,result[0])
        return result[0]
    }).catch((err: any) => {
        console.error(`${new Date()}.[projectsServ].[getProject].[ERR].ProjectModel.Find.catch`,err)
        return err
    })
}

export const deleteProjectDB = async (projectToDelete: Object): Promise<boolean>  => {
    dbgConsoleLog(FILENAME, `[deleteProjectDB].Init`)
    dbgConsoleLog(FILENAME, `[deleteProjectDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[deleteProjectDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.pre`)
    return await ProjectModel.findOneAndDelete(projectToDelete).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.res=`, res)
        mongoose.connection.close()
        return true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[projectsDBManager].[deleteProjectDB].[ERR].findOneAndDelete.Error=`, err.message)
        return false
    })
}