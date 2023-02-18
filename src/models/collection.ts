export interface Collection {
    _id: string,
    userId?:string,
    topic?: string,
    name: string,
    description: string,
    fields:Array<string>,
    createdAt: string,
    updatedAt: string,
    isChecked?:boolean,
}