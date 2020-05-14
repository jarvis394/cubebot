export interface IUsersGetModel {
  first_name: string
  last_name: string
  [key: string]: any
}

export interface IUserModel {
  id?: number
  money: number
  reputation: number
  guild?: number
  hidden: string
}
