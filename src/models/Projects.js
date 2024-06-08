const mongoose = require('mongoose')
const { Schema, model } = mongoose
const types = require('../types')
const { States, EqParams } = types

const channelConfig = new Schema({
    volume: Number,
    states: States,
    EQ: EqParams
})

const channelListItem = new Schema({
    sampleId: { type: Schema.Types.ObjectId, ref: 'Sample', required: true },
    channelConfig: channelConfig
})

const projectSchema = new Schema({
    userId: String,
    projectName: String,
    createdDate: String,
    savedDate: String,
    totalDuration: Number,
    channelList: [channelListItem]
})

projectSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const ProjectModel = model('Project', projectSchema)

module.exports = ProjectModel