export interface TreeNode {
    key: string
    type: string
    path: string
    depth: number
    value: any
    length?: number
    children: any[]
}