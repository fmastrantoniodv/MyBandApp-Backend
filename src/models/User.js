const mongoose = require('mongoose')
const { Schema, model } = mongoose

const userSchema = new Schema({
    email: String,
    usrName: String,
    password: String,
    plan: String,
    expirationPlanDate: Date,
    registerDate: Date
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const UserModel = model('User', userSchema)

module.exports = UserModel
/*
UserModel.find({}).then(result => {
    console.log(result)
    mongoose.connection.close()
})
const user = new UserModel({
    email: 'eladmin@gmail.com',
    usrName: 'primerUsr',
    password: 'siempreClaro',
    plan: 'free',
    expirationPlanDate: new Date(),
    registerDate: new Date()
})

user.save()
    .then((result)=>{
        console.log(result)
        mongoose.connection.close()
    }).catch(err => {
        console.error(err)
    })
    */