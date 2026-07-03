import { User } from "../../user/interface/user.interface"

export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse {
    accessToken: string,
    user: User
}