import { UserEntry , User } from '../types'
import usersMock from './usersMock.json'

const usersList: Array<User> = usersMock.usersList as Array<User>

export const getUsersList = (): Array<User> | undefined => {
    return usersList
}

export const addNewUser = ( newUserEntry: UserEntry ): User | boolean => {
    console.log('user data:',newUserEntry)
    var indexUser = usersList.findIndex(value => value.email === newUserEntry.email)
    var newUser: User = {
        userId: ""+usersList.length + 1,
        email: newUserEntry.email,
        usrName: newUserEntry.usrName,
        password: newUserEntry.password,
        plan: newUserEntry.plan,
        expirationPlanDate: "2025-05-22",
        registerDate: new Date().toLocaleDateString()
    }
    if(indexUser < 0){
        usersList.push(newUser)    
        return newUser
    }else{
        return false
    }
}
/*
export const deleteFav = (userId: number, sampleId: string): boolean => {
    console.log('fav from userId:',userId)
    console.log('fav sampleId:', sampleId)
    var indexDeleteFav = favouritesList.findIndex(value => value.sampleId === sampleId)
    if(indexDeleteFav >= 0){
        favouritesList.splice(indexDeleteFav, 1)
        return true
    }else{
        return false
    }
}
*/