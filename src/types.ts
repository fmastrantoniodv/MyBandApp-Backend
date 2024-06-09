export type EqParams = {
    low: number,
    mid: number,
    high: number
}

export type States = {
    solo: boolean,
    muted: boolean
}

export type ChannelConfig = {
        states: States,
        volume: number,
        EQ: EqParams
}

export type SoundListItem = {
    sampleId: string,
    channelConfig: ChannelConfig
}

export type Sample = {
    sampleId: string,
    sampleName: string,
    collectionCode: string,
    duration: number,
    tempo: number
}

export type SampleEntry = Omit<Sample, 'sampleId'>

export type User = {
    email: string,
    usrName: string,
    password: string,
    plan: PlanType,
    expirationPlanDate: Date,
    registerDate: Date
}

export type UserDataType = Omit<User, 'password'>
export type UserEntry = Pick<User, 'usrName' | 'email' | 'password' | 'plan'>

export type ProjectInfo = {
    userId: string,
    projectName: string,
    createdDate: Date,
    savedDate: Date,
    totalDuration: number
}

export enum PlanType {
    Free = 'free',
    Trial = 'trial',
    Pro = 'pro',
    Admin = 'admin'
}

export type Collection = {
    collectionId: string,
    collectionCode: string,
    collectionName: string,
    uploadDate: Date,
    plan: PlanType
    tags: Array<string>
}

export type CollectionEntry = Omit<Collection, 'collectionId'>