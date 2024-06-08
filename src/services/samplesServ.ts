import { Sample, SampleEntry } from '../types'
import mongoose from 'mongoose'
const connectToDatabase = require('../mongo.js');
const SampleModel = require('../models/Samples.js')

console.log('####Init samplesServ#######')

export const addNewSample = async ( newSampleEntry: SampleEntry ): Promise<boolean>  => {
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].sample data entry:`,newSampleEntry)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].checkSampleExistDB.pre`)
    const sampleExist = await checkSampleExistDB(newSampleEntry.sampleName, newSampleEntry.collectionCode)
    console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].checkSampleExistDB.post`)
    if(sampleExist === false){
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.pre`)
        await addSampleToDB(newSampleEntry)
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.post`)
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].addSampleToDB.return=true`)
        return true
    }else{
        console.log(`${new Date()}.[samplesServ].[addNewSample].[MSG].Resp=Sample ya existe en la db`)
        throw new Error('Sample ya existe')
    }
}

export const checkSampleExistDB = async ( sampleName: string, collectionCode: string): Promise<boolean> => {
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].sampleName=${sampleName}, collectionCode=${collectionCode}`)
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].connectDB.post`)
    return await SampleModel.find({sampleName: sampleName, collectionCode: collectionCode}).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[samplesServ].[checkSampleExistDB].[MSG].SampleModel.No existe sample con las caracteristicas ingresadas`)
            return false
        }else{
            return true
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkSampleExistDB].[ERR].SampleModel.Find.catch`,err)
        return err
    })
}

export const checkArrayOfSamplesExistDB = async ( sampleList: Array<SampleEntry>): Promise<boolean> => {
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].sampleList=`, sampleList)
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].connectDB.post`)
    const query = sampleList.map(sample => ({
        sampleName: sample.sampleName,
        collectionCode: sample.collectionCode
      }));
    return await SampleModel.find({ $or: query }).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.No existen samples con las caracteristicas ingresadas`)
            return false
        }else{
            console.log(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[MSG].SampleModel.Existen samples con las caracteristicas ingresadas`)
            var sampleExistList: string = "";
            result.forEach((sampleExist: Sample) => {
                sampleExistList =+ ', '+sampleExist.sampleName
            });
            throw new Error(`Ya existe el/los samples: ${sampleExistList}`)
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[checkArrayOfSamplesExistDB].[ERR].SampleModel.Find.catch`,err)
        return err
    })
}

const addSampleToDB = async (newSample: SampleEntry) => {
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].connectDB.post`)
    const sampleToDB = new SampleModel(newSample)
    console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].SampleModel.save.pre`)
    await sampleToDB.save().then((res: any)=>{
        console.log(`${new Date()}.[samplesServ].[addSampleToDB].[MSG].SampleModel.save.res=`, res)
        mongoose.connection.close()
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
    console.log(`${new Date()}.[samplesServ].[addUserToDB].[MSG].SampleModel.save.post`)
}

export const addSamplesListToDB = async (newSamplesList: Array<SampleEntry>): Promise<Array<string>> => {
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].SampleModel.insertMany.pre`)
    return await SampleModel.insertMany(newSamplesList).then((res: any)=>{
        console.log(`${new Date()}.[samplesServ].[addSamplesListToDB].[MSG].SampleModel.insertMany.res=`, res)
        mongoose.connection.close()
        var arraySamplesId: Array<string> = []
        res.forEach((item: any) => {
            arraySamplesId.push(item._id)
        })
        return arraySamplesId
    })
    .catch((err:any)=>{
        console.error(`${new Date()}.[samplesServ].[addUserToDB].[ERR].Error=`, err.message)
    })
}
/*

const changeUserPassDB = async (id: string, newPass: string) => {
    console.log(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].id=`,id)
    console.log(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].connectDB.post`)
    return await UserModel.findByIdAndUpdate(id, {password: newPass}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return true
    }).catch((err: any)=>{
        console.error(`${new Date()}.[samplesServ].[changeUserPassDB].[MSG].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })    
}

const changeUserPlanDB = async (id: string, newPlan: PlanType) => {
    console.log(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.pre`)
    return await UserModel.findByIdAndUpdate(id, {plan: newPlan}, { new: true }).then((result: any)=>{
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.userUpdated=`,result)
        return result
    }).catch((err: any)=>{
        console.error(`${new Date()}.[samplesServ].[changeUserPlanDB].[MSG].UserModel.findByIdAndUpdate.error=`, err.message);
        return false
    })
};

const validateLogin = async (email: string, pass: string): Promise<UserData | boolean> => {
    console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].connectDB.post`)
    console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].UserModel.find.pre`)
    return await UserModel.find({email: email, password: pass}).then((result: any) => {
        mongoose.connection.close()
        console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].UserModel.result=`,result[0])
        if(result[0] === undefined){
            console.log(`${new Date()}.[samplesServ].[validateLogin].[MSG].UserModel.credenciales invalidas`)
            return false
        }else{
            return result[0]
        }
    }).catch((err: any) => {
        console.error(`${new Date()}.[samplesServ].[validateLogin].[ERR].UserModel.Find.catch`,err)
        return err
    })
}

const getUserDB = async (usrNameEntry: string) => {
    console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].connectDB.pre`)
    await connectToDatabase()
    console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].connectDB.post`)
    console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].UserModel.find.pre`)
    return await UserModel.find({ usrName: usrNameEntry}).then((result: any) => {
        mongoose.connection.close()
        if(result.length > 0){
            console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].UserModel.result=hay users, se toma el primero`)
            var userData: UserData = {
                id: result[0]._id.toString(),
                email: result[0].email,
                usrName: result[0].usrName,
                plan: result[0].plan,
                expirationPlanDate: result[0].expirationPlanDate,
                registerDate: result[0].registerDate
            }
            console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].UserModel.return.userData=`, userData)
            return userData
        }else{
            console.log(`${new Date()}.[samplesServ].[getUserDB].[MSG].UserModel.result.hay users, se toma el primero`)
            return undefined
        }
    }).catch((err: any)=>{
        console.error(`${new Date()}.[samplesServ].[getUserDB].[ERR].UserModel.Find.catch`,err)
        return err
    })
}





export const userLogin = async (email: string, pass: string): Promise<UserData | boolean>=> {
    console.log(`${new Date()}.[samplesServ].[userLogin].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[userLogin].[MSG].login data: email=${email}, pass=${pass}`)
    const userData = await validateLogin(email, pass)
    return userData
}

export const changePlan = async (userId: string, newPlan: PlanType): Promise<UserData | boolean>=>{
    console.log(`${new Date()}.[samplesServ].[changePlan].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[changePlan].[MSG].req data: userId=${userId}, newPlan=${newPlan}`)
    const resultUpdate = await changeUserPlanDB(userId, newPlan)
    return resultUpdate
}

export const changePass = async (email: string, password: string, newPass: string): Promise<boolean>=>{
    console.log(`${new Date()}.[samplesServ].[changePass].[MSG].Init`)
    console.log(`${new Date()}.[samplesServ].[changePass].[MSG].req data: email=${email}, password=${password}, newPass=${newPass}`)
    console.log(`${new Date()}.[samplesServ].[changePass].[MSG].validateLogin.pre`)
    const userData = await validateLogin(email, password)
    console.log(`${new Date()}.[samplesServ].[changePass].[MSG].validateLogin.post`)
    console.log(`${new Date()}.[samplesServ].[changePass].[MSG].userData=`,userData)
    if(typeof userData === 'boolean'){
        throw new Error('Credenciales invalidas')
    }
    const resultUpdate = await changeUserPassDB(userData.id, newPass)
    return resultUpdate
}
    
*/