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
    userId: string,
    email: string,
    usrName: string,
    password: string,
    plan: PlanType,
    expirationPlanDate: string,
    registerDate: string
}

export type UserEntry = Pick<User, 'usrName' | 'email' | 'password' | 'plan'>

export enum PlanType {
    Free = 'free',
    Trial = 'trial',
    Pro = 'pro',
    Admin = 'admin'
}

export type SampleToChannel = Omit<Sample, 'collectionId'>
