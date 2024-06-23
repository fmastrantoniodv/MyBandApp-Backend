import { UserEntry , User, PlanType } from '../types'
import { calculateExpirationDate } from '../utils'
import { ServResponse } from '../interfaces';
import { changeUserPlanDB, validateLoginDB, changeUserPassDB,
    //, getUserDB, 
    addUserToDB  } from '../db/usersDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()
console.log('####Init userServ#######')

export const addNewUser = async ( newUserEntry: UserEntry ): Promise<ServResponse>  => {
    const resp: ServResponse = { success: false }
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].user data entry:`,newUserEntry)
    var registerDate = new Date()
    var newUser: User = {
        email: newUserEntry.email,
        usrName: newUserEntry.usrName,
        password: newUserEntry.password,
        plan: newUserEntry.plan,
        expirationPlanDate: calculateExpirationDate(newUserEntry.plan, registerDate),
        registerDate: registerDate
    }
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
    const userData = await validateLoginDB(email, pass)
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].validateLoginDB.post.result=`, userData)
    if(userData.success){
        dbgConsoleLog(FILENAME, `[userLogin].[MSG].validateLoginDB.se valido el login ok`)
        resp.success = true
    }
    resp.result = userData.result
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
    dbgConsoleLog(FILENAME, `[changePass].[MSG].changeUserPassDB.pre`)
    const resultUpdate = await changeUserPassDB(email, password, newPass)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].changeUserPassDB.post.result=`, resultUpdate)
    if(resultUpdate.success){
        resp.success = true
    }
    resp.result = resultUpdate.result
    return resp
}