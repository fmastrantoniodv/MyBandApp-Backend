import { UserEntry , User, PlanType } from '../types'
import { calculateExpirationDate } from '../utils'
import { UserData } from '../interfaces';
import { changeUserPassDB, changeUserPlanDB, validateLogin, getUserDB, addUserToDB  } from './db/usersDBManager'
import { dbgConsoleLog, getStackFileName } from '../utils';
const FILENAME = getStackFileName()
console.log('####Init userServ#######')

export const addNewUser = async ( newUserEntry: UserEntry ): Promise<boolean>  => {
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
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].getUserDB.pre`)
    const userData = await getUserDB(newUserEntry.usrName)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].getUserDB.post`)
    dbgConsoleLog(FILENAME, `[addNewUser].[MSG].getUserDB.userData=`, userData)
    if(userData === undefined){
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.pre`)
        await addUserToDB(newUser)
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.post`)
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].addUserToDB.return=true`)
        return true
    }else{
        dbgConsoleLog(FILENAME, `[addNewUser].[MSG].Resp=Usuario ya existe en la db`)
        throw new Error('Usuario ya existe')
    }
}

export const userLogin = async (email: string, pass: string): Promise<UserData | boolean>=> {
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[userLogin].[MSG].login data: email=${email}, pass=${pass}`)
    const userData = await validateLogin(email, pass)
    return userData
}

export const changePlan = async (userId: string, newPlan: PlanType): Promise<UserData | boolean>=>{
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[changePlan].[MSG].req data: userId=${userId}, newPlan=${newPlan}`)
    const resultUpdate = await changeUserPlanDB(userId, newPlan)
    return resultUpdate
}

export const changePass = async (email: string, password: string, newPass: string): Promise<boolean>=>{
    dbgConsoleLog(FILENAME, `[changePass].[MSG].Init`)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].req data: email=${email}, password=${password}, newPass=${newPass}`)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].validateLogin.pre`)
    const userData = await validateLogin(email, password)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].validateLogin.post`)
    dbgConsoleLog(FILENAME, `[changePass].[MSG].userData=`,userData)
    if(typeof userData === 'boolean'){
        throw new Error('Credenciales invalidas')
    }
    const resultUpdate = await changeUserPassDB(userData.id, newPass)
    return resultUpdate
}