import { Material } from "../../material/interface/material.interface"
import { Meet } from "../../meet/interface/meet.interface"
import { Notice } from "../../notice/interface/notice.interface"

export interface Group {
    id: number
    name: string
    creation_date: Date 

    comments: Comment[]
    notices: Notice[]
    meets: Meet[]
    materials: Material[]
}
    