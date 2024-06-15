const mongoose = require('mongoose')
const { Schema, model } = mongoose

const sampleSchema = new Schema({
    sampleName: String,
    collectionCode: String,
    duration: Number,
    tempo: Number,
})

sampleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const SampleModel = model('Sample', sampleSchema)

module.exports = SampleModel
module.exports = sampleSchema