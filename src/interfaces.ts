import { SoundListItem, PlanType, SampleToChannel } from './types'

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
    soundList?: Array<SoundListItem>
}

export interface CollectionSampleLibrary {
    collectionId: string,
    collectionName: string,
    uploadDate: string,
    plan: PlanType | undefined,
    sampleList: Array<SampleToChannel>
    tags: Array<string>,
}
