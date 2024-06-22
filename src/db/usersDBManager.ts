import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const UserModel = require('../models/User.js')
import { PlanType, User } from '../types'
import { DBResponse } from '../interfaces'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const changeUserPassDB = async (email: string, password: string, newPass: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].email=${email}, password=${password}, newPass=${newPass},`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].connectDB.post`)
    return await UserModel.findOneAndUpdate({ email, password }, {password: newPass}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].UserModel.findOneAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'INVALID_MAIL_PASSWORD'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPassDB].UserModel.findOneAndUpdate.error=`, err.message);
        resp.result = err.message
        return resp
    })    
}

export const changeUserPlanDB = async (id: string, newPlan: PlanType): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.error=`, err.message);
        resp.result = err.message
        return resp
    })
};

export const validateLoginDB = async (email: string, pass: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].connectDB.post`)
    dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].UserModel.find.pre`)
    return await UserModel.find({email: email, password: pass}).then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].UserModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[usersServ].[validateLogin].UserModel.credenciales invalidas`)
            resp.result = 'INVALID_MAIL_PASSWORD'
        }else{
            resp.success = true
            resp.result = result[0]
        }
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[usersServ].[validateLogin].[ERR].UserModel.Find.catch`,err)
        resp.result = err.message
        return resp
    })
}

export const addUserToDB = async (newUser: User): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].connectDB.post`)
    const userToDB = new UserModel(newUser)
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.pre`)
    await userToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.res=`, res)
        mongoose.connection.close()
        resp.result = res
        resp.success = true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error.message=`, err.message)
        //catcheo el error especifico de indice duplicado y manejo la respuesta de "usuario existente"
        if(err.errorResponse.code === 11000){
            resp.result = 'USR_EXIST'    
        }else{
            resp.result = err.message
        }
    })
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.post`)
    return resp
}
