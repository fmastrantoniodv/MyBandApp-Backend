const mongoose = require('mongoose')
const { Schema, model } = mongoose

const collectionSchema = new Schema({
    collectionCode: String,
    collectionName: String,
    uploadDate: String,
    plan: String,
    templateId: { type: Schema.Types.ObjectId, ref: 'Project', required: false },
    templateName: String,
    sampleList: [{ type: Schema.Types.ObjectId, ref: 'Sample', required: true }],
    tags: [{ type: String, required: false}]
})

collectionSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const CollectionModel = model('Collection', collectionSchema)

module.exports = CollectionModel