import { UserEntry , User } from '../types'
import mongoose from 'mongoose'
const UserModel = require('../models/User.js')

//const usersList: Array<User> = usersMock.usersList as Array<User>
var usersList: Array<User>
UserModel.find({}).then((result: any) => {
    console.log(result)
    usersList = result
    mongoose.connection.close()
}).catch((err: any)=>{
    console.error(err)
})

export const getUsersList = (): Array<User> | undefined => {
    return usersList
}

export const addNewUser = ( newUserEntry: UserEntry ): User | boolean => {
    console.log('user data:',newUserEntry)
    
    var indexUser = usersList.findIndex(value => value.email === newUserEntry.email)
    if(indexUser < 0){
        var registerDate = new Date()
        var calExpDate = registerDate.getFullYear() + 1;
        var expDate = new Date(registerDate)
        expDate.setFullYear(calExpDate)
        var newUser: User = {
            userId: ""+usersList.length + 1,
            email: newUserEntry.email,
            usrName: newUserEntry.usrName,
            password: newUserEntry.password,
            plan: newUserEntry.plan,
            expirationPlanDate: expDate,
            registerDate: new Date()
        }
        require('./mongo')
        const userToDB = new UserModel(newUser)
        userToDB.save()
            .then(()=>{
                console.log('new user saved:', newUser)
            })
            .catch((err:any)=>{
            console.error(err.message)
        })
        usersList.push(newUser)    
        return newUser
    }else{
        return false
    }
}

export const userLogin = (email: string, pass: string): User | undefined=> {
    console.log('login data: '+email+', '+pass)
    var user = usersList.find(value => value.email === email && value.password === pass)
    return user
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