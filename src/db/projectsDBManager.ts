const ProjectModel = require('../models/Projects')
import { DBResponse, ProjectEntry, ProjectSave} from '../interfaces'
import { dbgConsoleLog, errorConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const saveProjectToDB = async (updatedProjectData: ProjectSave): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[saveProjectToDB].Init`)
    dbgConsoleLog(FILENAME, `[saveProjectToDB].ProjectModel.save.pre`)
    return await ProjectModel.findByIdAndUpdate(updatedProjectData.projectId, { $set: updatedProjectData }, { new: true }).then((res: any)=>{
        dbgConsoleLog(FILENAME, `[saveProjectToDB].ProjectModel.save.res=`, res)
        if(res === null){
            resp.result = 'PROJECT_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = res
        }
        return resp
    }).catch((err:any)=>{
        errorConsoleLog(FILENAME,`[saveProjectToDB].Error=${err.message}`)
        resp.success = false
        resp.result = err.message
        return resp
    })
}

export const addProjectToDB = async (newProjectEntry: ProjectEntry): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addProjectToDB].Init`)
    const projectToDB = new ProjectModel(newProjectEntry)
    dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.pre`)
    return await projectToDB.save().then((result: any)=>{
        dbgConsoleLog(FILENAME, `[addProjectToDB].ProjectModel.save.result=`, result)
        resp.success = true
        resp.result = result
        return resp
    })
    .catch((err:any)=>{
        errorConsoleLog(FILENAME, `[usersServ].[addUserToDB].[ERR].Error=${err.message}`)
        resp.result = err.message
        return resp
    })
}

export const getProjectByIdFromDB = async (id: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].id=${id}`)
    return await ProjectModel.findById(id).populate({
        path: 'channelList.sampleId',
        model: 'Sample'
    }).then((result: any) => {
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
        errorConsoleLog(FILENAME, `[projectsServ].[getProjectByIdFromDB].ProjectModel.Find.catch error=`,err)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[getProjectByIdFromDB].ProjectModel.catch.resp=`,resp)
        return resp
    })
}

export const deleteProjectDB = async (projectToDelete: Object): Promise<DBResponse>  => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[deleteProjectDB].Init`)
    dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.pre`)
    return await ProjectModel.findOneAndDelete(projectToDelete).then((res: any)=>{
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
        errorConsoleLog(FILENAME, `[deleteProjectDB].[ERR].findOneAndDelete.Error=${err.message}`)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[deleteProjectDB].ProjectModel.findOneAndDelete.catch.resp=`,resp)
        return resp
    })
}

export const getUserProjectsFromDB = async (userId: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].Init`)
    dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].id=${userId}`)
    return await ProjectModel.find({ userId: userId }).then((result: Array<Object>) => {       
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.result=`,result)
        var listToReturn: Array<Object> = []
        if(result !== undefined){
            result.map((project: any) => {
                var projectValue = {
                    id: project['id'],
                    projectName: project['projectName'],
                    savedDate: project['savedDate']
                }
                listToReturn.push(projectValue)
            })
            resp.success = true
            resp.result = listToReturn
        }else{
            resp.result = 'PROJECTS_NOT_FOUND'
        }
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.resp=`,resp)
        return resp
    }).catch((err: any) => {
        errorConsoleLog(FILENAME, `[projectsServ].[getUserProjectsFromDB].[ERR].ProjectModel.Find.catch error=`, err)
        resp.result = err.message
        dbgConsoleLog(FILENAME, `[getUserProjectsFromDB].ProjectModel.catch.resp=`,resp)
        return resp
    })
}