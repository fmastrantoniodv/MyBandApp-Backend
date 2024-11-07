const UserModel = require('../models/User.js')
import { PlanType, User } from '../types'
import { DBResponse } from '../interfaces'
import { dbgConsoleLog, errorConsoleLog, generateVerificationCode, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const changeUserPassDB = async (email: string, newPass: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changeUserPassDB].Init`)
    dbgConsoleLog(FILENAME, `[changeUserPassDB].email=${email}, newPass=${newPass}`)
    return await UserModel.findOneAndUpdate({ email }, {password: newPass}, { new: true }).then((result: any)=>{
        dbgConsoleLog(FILENAME, `[changeUserPassDB].UserModel.findOneAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'INVALID_MAIL'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        errorConsoleLog(FILENAME, `[changeUserPassDB].UserModel.findOneAndUpdate.error=${err.message}`);
        resp.result = err.name
        return resp
    })    
}

export const changeUserPlanDB = async (id: string, newPlan: PlanType): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].Init`)
    dbgConsoleLog(FILENAME, `[changeUserPlanDB].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        dbgConsoleLog(FILENAME, `[changeUserPlanDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        errorConsoleLog(FILENAME, `[changeUserPlanDB].UserModel.findByIdAndUpdate.error=${err.message}`);
        resp.result = err.name
        return resp
    })
};

export const validateLoginDB = async (email: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[validateLoginDB].Init`)
    dbgConsoleLog(FILENAME, `[validateLoginDB].UserModel.find.pre`)
    return await UserModel.find({email: email}).populate('favList').then((result: any) => {
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
        errorConsoleLog(FILENAME, `[validateLoginDB].UserModel.Find.catch error=`,err)
        resp.result = err.name
        return resp
    })
}

export const addUserToDB = async (newUser: User): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addUserToDB].Init`)
    const userToDB = new UserModel(newUser)
    dbgConsoleLog(FILENAME, `[addUserToDB].UserModel.save.pre`)
    await userToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[addUserToDB].UserModel.save.res=`, res)
        resp.result = res
        resp.success = true
    })
    .catch((err:any)=>{
        errorConsoleLog(FILENAME, `[addUserToDB].Error.message=${err.message}`)
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
    dbgConsoleLog(FILENAME, `[getFavouritesList].UserModel.findById.pre`)
    await UserModel.findById(userId).populate({
        path: 'favList',
        populate: {
          path: 'collectionInfo', 
          select: 'collectionName', 
        }
      }).then((result: any) => {
        dbgConsoleLog(FILENAME, `[getFavouritesListDB].UserModel.findById.result=`,result)
        if(result === null){
            dbgConsoleLog(FILENAME, `[getFavouritesListDB].UserModel.findById.No se encontro user`)
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result.favList.map((sample: any) => ({
                ...sample.toJSON(), 
                collectionName: sample.collectionInfo?.collectionName
              }));
        }
        return resp
    }).catch((err: any) => {
        errorConsoleLog(FILENAME, `[getFavouritesListDB].UserModel.findById.catch error=`,err)
        resp.result = err.name
        return resp
    })
    dbgConsoleLog(FILENAME, `[getFavouritesList].UserModel.findById.post`)
    return resp
}

export const updateUserFavsDB = async (userId: string, sampleId: string, action: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[updateUserFavsDB].Init`)
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
        dbgConsoleLog(FILENAME, `[updateUserFavsDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        if(result === null){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = result
        }
        return resp
    }).catch((err: any)=>{
        errorConsoleLog(FILENAME, `[updateUserFavsDB].UserModel.findByIdAndUpdate.error=${err.message}`);
        resp.result = err.name
        return resp
    })
}

export const saveVerifyCodeDB = async (email: string): Promise<DBResponse> => {
    const resp: DBResponse = { success: false }
    dbgConsoleLog(FILENAME, `[saveVerifyCodeDB].Init`)
    dbgConsoleLog(FILENAME, `[saveVerifyCodeDB].generate code & expirationTime`)
    const code = generateVerificationCode()
    const expirationTime = Date.now() + 10 * 60 * 1000;
    dbgConsoleLog(FILENAME, `[saveVerifyCodeDB].code=${code}, expirationTime=${expirationTime}`)
    dbgConsoleLog(FILENAME, `[saveVerifyCodeDB].UserModel.updateOne.pre`)
    return await UserModel.updateOne(
        { email: email },
        { verificationCode: code, verificationExpires: expirationTime }
      ).then((result: any)=>{
        dbgConsoleLog(FILENAME, `[saveVerifyCodeDB].UserModel.updateOne.post result=`, result)
        if(result === null || result.matchedCount < 1){
            resp.result = 'USR_NOT_FOUND'
        }else{
            resp.success = true
            resp.result = code.toString()
        }
        return resp
    }).catch((err: any)=>{
        errorConsoleLog(FILENAME, `[saveVerifyCodeDB].UserModel.updateOne.error=${err.message}`);
        resp.result = err.name
        return resp
    })
}
