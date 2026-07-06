import { User } from "../../user/interface/user.interface"

export interface LoginRequest {
    email: string,
    password: string
}

export interface LoginResponse {
    accessToken: string,
    user: User
}

export interface RegisterRequest {
    name: string,
    email: string,
    institution_id: number,
    password: string
}

export type RegisterResponse = LoginResponse;
