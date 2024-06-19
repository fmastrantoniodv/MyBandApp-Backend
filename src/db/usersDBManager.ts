import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const UserModel = require('../models/User.js')
import { PlanType, User } from '../types'
import { UserData } from '../interfaces'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

export const changeUserPassDB = async (id: string, newPass: string) => {
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].id=`,id)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].connectDB.post`)
    return await UserModel.findByIdAndUpdate(id, {password: newPass}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[usersServ].[changeUserPassDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return true
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPassDB].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })    
}

export const changeUserPlanDB = async (id: string, newPlan: PlanType) => {
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        dbgConsoleLog(FILENAME, `[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return result
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPlanDB].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })
};

export const validateLogin = async (email: string, pass: string): Promise<UserData | boolean> => {
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
            return false
        }else{
            return result[0]
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[usersServ].[validateLogin].[ERR].UserModel.Find.catch`,err)
        return err
    })
}

export const getUserDB = async (usrNameEntry: string) => {
    dbgConsoleLog(FILENAME, `[getUserDB].Init`)
    dbgConsoleLog(FILENAME, `[getUserDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[getUserDB].connectDB.post`)
    dbgConsoleLog(FILENAME, `[getUserDB].UserModel.find.pre`)
    return await UserModel.find({ usrName: usrNameEntry}).then((result: any) => {
        mongoose.connection.close()
        if(result.length > 0){
            dbgConsoleLog(FILENAME, `[getUserDB].UserModel.result=hay users, se toma el primero`)
            var userData: UserData = {
                id: result[0]._id.toString(),
                email: result[0].email,
                usrName: result[0].usrName,
                plan: result[0].plan,
                expirationPlanDate: result[0].expirationPlanDate,
                registerDate: result[0].registerDate
            }
            dbgConsoleLog(FILENAME, `[getUserDB].UserModel.return.userData=`, userData)
            return userData
        }else{
            dbgConsoleLog(FILENAME, `[getUserDB].UserModel.result.hay users, se toma el primero`)
            return undefined
        }
    }).catch((err: any)=>{
        console.error(`[${new Date()}].[usersServ].[getUserDB].[ERR].UserModel.Find.catch`,err)
        return err
    })
}

export const addUserToDB = async (newUser: User) => {
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].Init`)
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].connectDB.pre`)
    await connectToDatabase()
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].connectDB.post`)
    const userToDB = new UserModel(newUser)
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.pre`)
    await userToDB.save().then((res: any)=>{
        dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    dbgConsoleLog(FILENAME, `[usersServ].[addUserToDB].UserModel.save.post`)
}
