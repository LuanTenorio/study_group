export interface User {
    id: number
    institution_id: number
    name: string
    email: string
}

export interface UpdateUserRequest {
    name: string
    email: string
    institution_id: number
}
