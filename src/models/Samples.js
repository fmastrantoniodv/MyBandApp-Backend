const mongoose = require('mongoose')
const { Schema, model } = mongoose
const { User } = require('./User.js')
const { Collection } = require('./Collections.js')

const sampleSchema = new Schema({
    sampleName: String,
    collectionCode: String,
    duration: Number,
    tempo: Number,
})

sampleSchema.virtual('collectionInfo', {
    ref: 'Collection',
    localField: 'collectionCode',
    foreignField: 'collectionCode',
    justOne: true
  });
  

sampleSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const SampleModel = model('Sample', sampleSchema)

module.exports = SampleModel