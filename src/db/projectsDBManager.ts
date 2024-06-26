import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const ProjectModel = require('../models/Projects')
import { DBResponse, ProjectEntry, ProjectSave} from '../interfaces'
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
        if(res === null){
            resp.result = 'PROJECT_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = res
        }
        return resp
    }).catch((err:any)=>{
        console.error(`${new Date()}.[${FILENAME}].[saveProjectToDB].[ERR].Error=`, err.message)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const addProjectToDB = async (newProjectEntry: ProjectEntry): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addProjectToDB].Init`)
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addProjectToDB].connectDB.post`)
    const projectToDB = new ProjectModel(newProjectEntry)
    dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.pre`)
    return await projectToDB.save().then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.result=`, result)
        resp.success = true
        resp.result = result
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
        resp.result = err.message
        return resp
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
        if(result !== null){
            resp.success = true
            resp.result = result
        }else{
            resp.result = 'PROJECT_NOT_FOUND'
        }
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.resp=`,resp)
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[projectsServ].[getProjectByIdFromDB].[ERR].ProjectModel.Find.catch`,err)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.catch.resp=`,resp)
        return resp
    })
}

export const deleteProjectDB = async (projectToDelete: Object): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[deleteProjectDB].Init`)
    dbgConsoleLog(FILENAME, `[deleteProjectDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[deleteProjectDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.pre`)
    return await ProjectModel.findOneAndDelete(projectToDelete).then((res: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.res=`, res)
        if(res !== null){
            resp.success = true
            resp.result = res
        }else{
            resp.result = 'PROJECT_NOT_FOUND'
        }
        return resp
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[${FILENAME}].[deleteProjectDB].[ERR].findOneAndDelete.Error=`, err.message)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.catch.resp=`,resp)
        return resp
    })
}

export const getUserProjectsFromDB = async (userId: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].id=${userId}`)
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].connectDB.post`)
    return await ProjectModel.find({ userId: userId }).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.result=`,result)
        if(result[0] !== undefined){
            resp.success = true
            resp.result = result
        }else{
            resp.result = 'PROJECTS_NOT_FOUND'
        }
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.resp=`,resp)
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[projectsServ].[getUserProjectsFromDB].[ERR].ProjectModel.Find.catch`,err)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.catch.resp=`,resp)
        return resp
    })
}