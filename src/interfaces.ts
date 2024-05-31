import { SoundListItem, PlanType, SampleToChannel, ProjectInfo, SampleFav, UserDataType } from './types'

export interface Project {
    projectInfo: ProjectInfo,
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

export interface Favourite {
    userId: string,
    favouritesList: Array<SampleFav>
}

export interface UserData extends UserDataType {
    id: string,
}