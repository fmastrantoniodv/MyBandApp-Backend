import { SoundListItem, PlanType, Sample } from './types'

export interface Project {
    id: number,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number,
    soundList?: Array<SoundListItem>
}

export interface CollectionSampleLibrary {
    collectionId: number,
    collectionName: string,
    availablePlanList: PlanType | undefined,
    tags: Array<string>,
    uploadDate: string,
    sampleList: Array<Sample>
}
