import { SoundListItem, PlanType, ProjectInfo, Sample, UserDataType, ChannelConfig, Collection, CollectionEntry } from './types'

export interface Project extends ProjectInfo{
    projectId: string,
    soundList?: Array<SoundListItem>
}

export interface CollectionSampleLibrary {
    collectionId: string,
    collectionName: string,
    uploadDate: string,
    plan: PlanType | undefined,
    sampleList: Array<Sample>
    tags: Array<string>,
}

export interface UserFavourites {
    userId: string,
    favouritesList: Array<Sample>
}

export interface UserData extends UserDataType {
    id: string,
}

export interface ChannelObj extends Sample{
    channelConfig: ChannelConfig
}

export interface CollectionItem extends Collection{
    sampleList: Array<Sample>
}

export interface CollectionItemEntry extends CollectionEntry{
    sampleList: Array<string>
}