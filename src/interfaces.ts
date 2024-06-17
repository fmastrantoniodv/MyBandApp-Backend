import { SoundListItem, PlanType, ProjectInfo, Sample, UserDataType, ChannelConfig, Collection, CollectionEntry, ProjectInfoSave } from './types'

export interface Project extends ProjectInfo {
    projectId: string,
    channelList?: Array<SoundListItem>
}

export interface ProjectEntry extends ProjectInfo {
    channelList?: Array<SoundListItem>
}

export interface ProjectSave extends ProjectInfoSave {
    projectId: string,
    channelList?: Array<SoundListItem>
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

export interface DBResponse {
    success: boolean,
    result?: Array<Object> | string
}

export interface ServResponse {
    success: boolean,
    result?: any
}