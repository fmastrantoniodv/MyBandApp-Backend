const mongoose = require('mongoose')
const { Schema, model } = mongoose

const favSchema = new Schema({
    userId: String,
    favSampleList: { type: Schema.Types.ObjectId, ref: 'Sample', required: true },
})

favSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const FavouriteModel = model('Favourite', userSchema)

module.exports = FavouriteModel