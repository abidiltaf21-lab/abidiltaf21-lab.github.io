export interface AuthModel {
  token: string
  refreshToken?: string
}

export interface UserModel {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  roles?: string[]
  occupation?: string
  phone?: string
}
