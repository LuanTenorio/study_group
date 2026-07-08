export interface CreateMeet {
    user_id: number
    title: string
    group_id: number
    date_time: Date
    description: string
    location: string
}

export interface UpdateMeet {
    group_id: number
    title: string
    date_time: Date
    description: string
    location: string
}