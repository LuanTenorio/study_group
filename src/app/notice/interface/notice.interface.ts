import { User } from "../../user/interface/user.interface"

export interface Notice {
    id: number
    user_id: number
    group_id: number
    created_at: Date
    expiration_date: Date  
    description: string 

    user: User
}