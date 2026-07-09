import { User } from "../../user/interface/user.interface"

export interface Meet {
    id: number
    title: string
    user_id: number
    group_id: number
    date_time: Date
    description: string
    location: string

    user?: User
}
