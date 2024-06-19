import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const ProjectModel = require('../models/Projects')
import { DBResponse, Project, ProjectEntry, ProjectSave} from '../interfaces'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const saveProjectToDB = async (updatedProjectData: ProjectSave): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[saveProjectToDB].Init`)
    dbgConsoleLog(FILENAME, `[saveProjectToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[saveProjectToDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[saveProjectToDB].ProjectModel.save.pre`)
    return await ProjectModel.findByIdAndUpdate(updatedProjectData.projectId, { $set: updatedProjectData }, { new: true }).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[saveProjectToDB].ProjectModel.save.res=`, res)
        mongoose.connection.close()
        resp.success = true
        resp.result = res
        return resp
    }).catch((err:any)=>{
        console.error(`${new Date()}.[${FILENAME}].[saveProjectToDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
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

export const getProjectByIdFromDB = async (id: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].id=${id}`)
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].connectDB.post`)
    return await ProjectModel.findById(id).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.result=`,result)
        resp.success = true
        resp.result = result
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.resp=`,resp)
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[projectsServ].[getProjectByIdFromDB].[ERR].ProjectModel.Find.catch`,err)
        resp.success = false
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.catch.resp=`,resp)
        return resp
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