export interface Collection {
    _id: string,
    userId?:string,
    topic: string,
    name: string,
    description: string,
    createdAt: string,
    isChecked?:boolean,
}