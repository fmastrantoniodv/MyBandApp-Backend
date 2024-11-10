const bcrypt = require('bcrypt');
import { UserEntry , User, PlanType } from '../types'
import { calculateExpirationDate } from '../utils'
import { ServResponse } from '../interfaces';
import { changeUserPlanDB, validateLoginDB, changeUserPassDB, getFavouritesListDB, addUserToDB, updateUserFavsDB, validateVerifyCodeDB } from '../db/usersDBManager'
import { getUserProjectsFromDB } from '../db/projectsDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()

async function encryptPassword(password: string) {
    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(password, saltRounds)
    return hashedPassword
}

export const addNewUser = async ( newUserEntry: UserEntry ): Promise<ServResponse>  => {
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].user data entry:`,newUserEntry)
    const hashedPass = await encryptPassword(newUserEntry.password)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].hashedPass=`,hashedPass)
    var registerDate = new Date()
    var newUser: User = {
        email: newUserEntry.email,
        usrName: newUserEntry.usrName,
        password: hashedPass,
        plan: newUserEntry.plan,
        expirationPlanDate: calculateExpirationDate(newUserEntry.plan, registerDate),
        registerDate: registerDate
    }
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.newUser=`,newUser)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.pre`)
    const resAddUser = await addUserToDB(newUser)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.post`)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.resAddUser=${resAddUser}`)
    if(resAddUser.success){
        //Set respuesta que se pudo agregar el usuario
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].Resp=Usuario agregado a la db`)
        resp.success = true
    }else{
        //Set respuesta generica que NO se pudo agregar el usuario
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].Resp=No se pudo agregar usuario`)
    }
    resp.result = resAddUser.result
    return resp    
}

export const userLogin = async (email: string, pass: string): Promise<ServResponse>=> {
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].login data: email=${email}, pass=${pass}`)
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].validateLoginDB.pre`)
    const userData: any = await validateLoginDB(email)
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].validateLoginDB.post.result=`, userData.result)
    if(userData.success && userData.result != undefined){
        const match = await bcrypt.compare(pass, userData.result.password)
        if(!match){
            resp.success = false
            resp.result = 'INVALID_MAIL_PASSWORD'
            return resp
        }
        dbgConsoleLog(FILENAME, `[userLogin].[MSG].validateLoginDB.se valido el login ok`)
        dbgConsoleLog(FILENAME, `[userLogin].[MSG].getUserProjectsFromDB.pre.id=`, userData.result['id'])
        const userProjects = await getUserProjectsFromDB(userData.result['id'])
        dbgConsoleLog(FILENAME, `[userLogin].[MSG].getUserProjectsFromDB.post.userProjects=`, userProjects)
        if(userProjects.success){
            resp.result = {
                id: userData.result['id'], 
                email: userData.result['email'], 
                usrName: userData.result['usrName'], 
                plan: userData.result['plan'], 
                expirationPlanDate: userData.result['expirationPlanDate'], 
                registerDate: userData.result['registerDate'],
                favList: userData.result['favList'],
                projectList: userProjects.result
            }
        }else{
            resp.result = userData.result
        }
        resp.success = true
    }else{
        resp.result = userData.result
    }
    return resp
}

export const changePlan = async (userId: string, newPlan: PlanType): Promise<ServResponse>=>{
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].req data: userId=${userId}, newPlan=${newPlan}`)
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].changeUserPlanDB.pre`)
    const resultUpdate = await changeUserPlanDB(userId, newPlan)
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].changeUserPlanDB.post.result=`, resultUpdate)
    if(resultUpdate.success){
        resp.success = true
    }
    resp.result = resultUpdate.result
    return resp
}

export const changePass = async (email: string, password: string, newPass: string): Promise<ServResponse>=>{
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[changePass].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].req data: email=${email}, password=${password}, newPass=${newPass}`)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].validateLoginDB.pre`)
    const userData: any = await validateLoginDB(email)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].validateLoginDB.post.result=`, userData.result)
    if(userData.success && userData.result != undefined){
        const match = await bcrypt.compare(password, userData.result.password)
        if(!match){
            resp.success = false
            resp.result = 'INVALID_MAIL_PASSWORD'
            return resp
        }
        dbgConsoleLog(FILENAME, `[changePass].[MSG].validateLoginDB.se valido el login ok`)
    }
    const hashedNewPass = await encryptPassword(newPass)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].hashedNewPass=`,hashedNewPass)
    const resultUpdate = await changeUserPassDB(email, hashedNewPass)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].changeUserPassDB.post.result=`, resultUpdate)
    if(resultUpdate.success){
        resp.success = true
    }
    resp.result = resultUpdate.result
    return resp
}

export const getUserFavList = async (userId: string): Promise<ServResponse>=> {
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[getUserFavList].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[getUserFavList].[MSG].userId=${userId}`)
    dbgConsoleLog(FILENAME, `[getUserFavList].[MSG].getFavouritesListDB.pre`)
    const userData = await getFavouritesListDB(userId)
    if(userData.success){
        dbgConsoleLog(FILENAME, `[getUserFavList].[MSG].getFavouritesListDB.se valido el login ok`)
        resp.success = true
    }
    resp.result = userData.result
    return resp
}

export const updateFav = async (userId: string, sampleId: string, action: string): Promise<ServResponse>=>{
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[updateFav].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[updateFav].[MSG].req data: userId=${userId}, sampleId=${sampleId}, action=${action}`)
    dbgConsoleLog(FILENAME, `[updateFav].[MSG].updateUserFavsDB.pre`)
    const resultUpdate = await updateUserFavsDB(userId, sampleId, action)
    dbgConsoleLog(FILENAME, `[updateFav].[MSG].updateUserFavsDB.post.result=`, resultUpdate)
    if(resultUpdate.success){
        resp.success = true
        if(action === "FAV"){
            resp.result = 'Sample agregado a favoritos con exito'
        }else{
            resp.result = 'Sample eliminado de favoritos con exito'
        }
    }else{
        resp.result = resultUpdate.result
    }
    return resp
}

export const validateCodeForgotPass = async (email: string, verifyCode: number): Promise<ServResponse> => {
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[validateCodeForgotPass].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[validateCodeForgotPass].[MSG].req data: email=${email}, verifyCode=${verifyCode}`)
    dbgConsoleLog(FILENAME, `[validateCodeForgotPass].[MSG].validateVerifyCodeDB.pre`)
    const resultVerify = await validateVerifyCodeDB(email, verifyCode)
    dbgConsoleLog(FILENAME, `[validateCodeForgotPass].[MSG].validateVerifyCodeDB.post.result=`, resultVerify)
    if(resultVerify.success){
        resp.success = true
        resp.result = 'Validación ok'
    }else if(resultVerify.result === 'VERIFY_CODE_EXPIRATED'){
        resp.result = "VERIFY_CODE_EXPIRATED"
    }else{
        resp.result = "CODE_ERROR"
    }
    return resp
}