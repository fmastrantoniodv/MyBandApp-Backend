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

export enum PlanType {
    Free = 'Free',
    Trial = 'Trial',
    Pro = 'Pro',
    Admin = 'Admin'
}

export type SampleToChannel = Omit<Sample, 'collectionId'>
