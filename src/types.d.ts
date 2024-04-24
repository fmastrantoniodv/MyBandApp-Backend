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
    id: string,
    sampleName: string,
    src: string,
    duration: number,
    channelConfig: ChannelConfig
}
