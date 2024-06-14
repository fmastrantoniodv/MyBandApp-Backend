import mongoose from 'mongoose'
const connectToDatabase = require('./mongo.js');
const UserModel = require('../../models/User.js')
import { PlanType, User } from '../../types'
import { UserData } from '../../interfaces'

export const changeUserPassDB = async (id: string, newPass: string) => {
    console.log(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].id=`,id)
    console.log(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].connectDB.post`)
    return await UserModel.findByIdAndUpdate(id, {password: newPass}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        console.log(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return true
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPassDB].[MSG].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })    
}

export const changeUserPlanDB = async (id: string, newPlan: PlanType) => {
    console.log(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        console.log(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return result
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })
};

export const validateLogin = async (email: string, pass: string): Promise<UserData | boolean> => {
    console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].connectDB.post`)
    console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].UserModel.find.pre`)
    return await UserModel.find({email: email, password: pass}).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].UserModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[usersServ].[validateLogin].[MSG].UserModel.credenciales invalidas`)
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
    console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].UserModel.find.pre`)
    return await UserModel.find({ usrName: usrNameEntry}).then((result: any) => {
        mongoose.connection.close()
        if(result.length > 0){
            console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].UserModel.result=hay users, se toma el primero`)
            var userData: UserData = {
                id: result[0]._id.toString(),
                email: result[0].email,
                usrName: result[0].usrName,
                plan: result[0].plan,
                expirationPlanDate: result[0].expirationPlanDate,
                registerDate: result[0].registerDate
            }
            console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].UserModel.return.userData=`, userData)
            return userData
        }else{
            console.log(`${new Date()}.[usersServ].[getUserDB].[MSG].UserModel.result.hay users, se toma el primero`)
            return undefined
        }
    }).catch((err: any)=>{
        console.error(`${new Date()}.[usersServ].[getUserDB].[ERR].UserModel.Find.catch`,err)
        return err
    })
}

export const addUserToDB = async (newUser: User) => {
    console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].connectDB.post`)
    const userToDB = new UserModel(newUser)
    console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].UserModel.save.pre`)
    await userToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].UserModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[usersServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    console.log(`${new Date()}.[usersServ].[addUserToDB].[MSG].UserModel.save.post`)
}
