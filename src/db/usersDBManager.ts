import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const UserModel = require('../models/User.js')
import { PlanType, User } from '../types'
import { DBResponse } from '../interfaces'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const changeUserPassDB = async (email: string, password: string, newPass: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changeUserPassDB].Init`)
    dbgConsoleLog(FILENAME, `[changeUserPassDB].email=${email}, password=${password}, newPass=${newPass},`)
    dbgConsoleLog(FILENAME, `[changeUserPassDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[changeUserPassDB].connectDB.post`)
    return await UserModel.findOneAndUpdate({ email, password }, {password: newPass}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[changeUserPassDB].UserModel.findOneAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'INVALID_MAIL_PASSWORD'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        console.error(`${new Date()}.[changeUserPassDB].UserModel.findOneAndUpdate.error=`, err.message);
        resp.result = err.name
        return resp
    })    
}

export const changeUserPlanDB = async (id: string, newPlan: PlanType): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].Init`)
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[changeUserPlanDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        console.error(`${new Date()}.[changeUserPlanDB].UserModel.findByIdAndUpdate.error=`, err.message);
        resp.result = err.name
        return resp
    })
};

export const validateLoginDB = async (email: string, pass: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[validateLoginDB].Init`)
    dbgConsoleLog(FILENAME, `[validateLoginDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[validateLoginDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[validateLoginDB].UserModel.find.pre`)
    return await UserModel.find({email: email, password: pass}).populate('favList').then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[validateLoginDB].UserModel.result=`,result[0])
        if(result[0] === undefined){
            dbgConsoleLog(FILENAME, `[validateLoginDB].UserModel.credenciales invalidas`)
            resp.result = 'INVALID_MAIL_PASSWORD'
        }else{
            resp.success = true
            resp.result = result[0]
        }
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[validateLoginDB].[ERR].UserModel.Find.catch`,err)
        resp.result = err.name
        return resp
    })
}

export const addUserToDB = async (newUser: User): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addUserToDB].Init`)
    dbgConsoleLog(FILENAME, `[addUserToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[addUserToDB].connectDB.post`)
    const userToDB = new UserModel(newUser)
    dbgConsoleLog(FILENAME, `[addUserToDB].UserModel.save.pre`)
    await userToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addUserToDB].UserModel.save.res=`, res)
        mongoose.connection.close()
        resp.result = res
        resp.success = true
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[addUserToDB].[ERR].Error.message=`, err.message)
        //catcheo el error especifico de indice duplicado y manejo la respuesta de "usuario existente"
        if(err.errorResponse.code === 11000){
            resp.result = 'USR_EXIST'    
        }else{
            resp.result = err.name
        }
    })
    dbgConsoleLog(FILENAME, `[addUserToDB].UserModel.save.post`)
    return resp
}

export const getFavouritesListDB = async (userId: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getFavouritesList].Init`)
    dbgConsoleLog(FILENAME, `[getFavouritesList].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getFavouritesList].connectDB.post`)
    dbgConsoleLog(FILENAME, `[getFavouritesList].UserModel.findById.pre`)
    await UserModel.findById(userId).populate('favList').then((result: any) => {
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[getFavouritesListDB].UserModel.findById.result=`,result)
        if(result === null){
            dbgConsoleLog(FILENAME, `[getFavouritesListDB].UserModel.findById.No se encontro user`)
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result.favList
        }
        return resp
    }).catch((err: any) => {
        console.error(`${new Date()}.[getFavouritesListDB].[ERR].UserModel.findById.catch`,err)
        resp.result = err.name
        return resp
    })
    dbgConsoleLog(FILENAME, `[getFavouritesList].UserModel.findById.post`)
    return resp
}

export const updateUserFavsDB = async (userId: string, sampleId: string, action: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[updateUserFavsDB].Init`)
    dbgConsoleLog(FILENAME, `[updateUserFavsDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[updateUserFavsDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[updateUserFavsDB].UserModel.findByIdAndUpdate.pre`)
    var queryToExec;
    if(action === 'FAV'){
        queryToExec = { $addToSet: { favList: sampleId } }
    }else if(action === 'UNFAV'){
        queryToExec = { $pull: { favList: sampleId } }
    }else{
        resp.result = "ACTION_CODE_INVALID"
        return resp
    }
    return await UserModel.findByIdAndUpdate(userId, queryToExec,{ new: true, useFindAndModify: false }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[updateUserFavsDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        console.error(`${new Date()}.[updateUserFavsDB].UserModel.findByIdAndUpdate.error=`, err.message);
        resp.result = err.name
        return resp
    })
}
