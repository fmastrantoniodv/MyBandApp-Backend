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

export type SoundListItem =         
{
    sample: Sample,
    channelConfig: ChannelConfig
}

export type SampleFav = {
    sampleId: string,
    sampleName: string
}

export type Sample = {
    sampleId: string,
    sampleName: string,
    srcUrl: string,
    duration: number,
    collectionId: number,
    tempo: number
}
export type User = {
    email: string,
    usrName: string,
    password: string,
    plan: PlanType,
    expirationPlanDate: Date,
    registerDate: Date
}

export type ProjectInfo = {
    id: number,
    userId: string,
    projectName: string,
    createdDate: string,
    savedDate: string,
    totalDuration: number
}

export type UserEntry = Pick<User, 'usrName' | 'email' | 'password' | 'plan'>

export type UserDataType = Omit<User, 'password'>

export enum PlanType {
    Free = 'free',
    Trial = 'trial',
    Pro = 'pro',
    Admin = 'admin'
}

export type SampleToChannel = Omit<Sample, 'collectionId'>
