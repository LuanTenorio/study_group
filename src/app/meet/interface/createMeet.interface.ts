export interface CreateMeet {
    user_id: number
    group_id: number
    date_time: Date
    description: string
    location: string
}

export interface UpdateMeet {
    group_id: number
    date_time: Date
    description: string
    location: string
}