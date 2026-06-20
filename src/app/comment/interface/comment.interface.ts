import { User } from "../../user/interface/user.interface"

export interface Comment {
    id: number
    group_id: number
    created_at: Date
    description: string 

    user: User
}