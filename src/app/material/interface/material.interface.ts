import { User } from "../../user/interface/user.interface"

export interface Material {
    id: number
    user_id: number
    group_id: number
    file_size: number
    file_type: string
    uploaded_at: Date  
    description: string

    user: User
}