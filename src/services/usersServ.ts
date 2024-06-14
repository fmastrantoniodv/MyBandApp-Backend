import { UserEntry , User, PlanType } from '../types'
import { calculateExpirationDate } from '../utils'
import { UserData } from '../interfaces';
import { changeUserPassDB, changeUserPlanDB, validateLogin, getUserDB, addUserToDB  } from './db/usersDBManager'

console.log('####Init userServ#######')

export const addNewUser = async ( newUserEntry: UserEntry ): Promise<boolean>  => {
    console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].user data entry:`,newUserEntry)
    var registerDate = new Date()
    var newUser: User = {
        email: newUserEntry.email,
        usrName: newUserEntry.usrName,
        password: newUserEntry.password,
        plan: newUserEntry.plan,
        expirationPlanDate: calculateExpirationDate(newUserEntry.plan, registerDate),
        registerDate: registerDate
    }
    console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].getUserDB.pre`)
    const userData = await getUserDB(newUserEntry.usrName)
    console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].getUserDB.post`)
    console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].getUserDB.userData=`, userData)
    if(userData === undefined){
        console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].addUserToDB.pre`)
        await addUserToDB(newUser)
        console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].addUserToDB.post`)
        console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].addUserToDB.return=true`)
        return true
    }else{
        console.log(`${new Date()}.[usersServ].[addNewUser].[MSG].Resp=Usuario ya existe en la db`)
        throw new Error('Usuario ya existe')
    }
}

export const userLogin = async (email: string, pass: string): Promise<UserData | boolean>=> {
    console.log(`${new Date()}.[usersServ].[userLogin].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[userLogin].[MSG].login data: email=${email}, pass=${pass}`)
    const userData = await validateLogin(email, pass)
    return userData
}

export const changePlan = async (userId: string, newPlan: PlanType): Promise<UserData | boolean>=>{
    console.log(`${new Date()}.[usersServ].[changePlan].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[changePlan].[MSG].req data: userId=${userId}, newPlan=${newPlan}`)
    const resultUpdate = await changeUserPlanDB(userId, newPlan)
    return resultUpdate
}

export const changePass = async (email: string, password: string, newPass: string): Promise<boolean>=>{
    console.log(`${new Date()}.[usersServ].[changePass].[MSG].Init`)
    console.log(`${new Date()}.[usersServ].[changePass].[MSG].req data: email=${email}, password=${password}, newPass=${newPass}`)
    console.log(`${new Date()}.[usersServ].[changePass].[MSG].validateLogin.pre`)
    const userData = await validateLogin(email, password)
    console.log(`${new Date()}.[usersServ].[changePass].[MSG].validateLogin.post`)
    console.log(`${new Date()}.[usersServ].[changePass].[MSG].userData=`,userData)
    if(typeof userData === 'boolean'){
        throw new Error('Credenciales invalidas')
    }
    const resultUpdate = await changeUserPassDB(userData.id, newPass)
    return resultUpdate
}