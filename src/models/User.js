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

userSchema.index({ usrName: 1}, { unique: true })
const UserModel = model('User', userSchema)

module.exports = UserModel