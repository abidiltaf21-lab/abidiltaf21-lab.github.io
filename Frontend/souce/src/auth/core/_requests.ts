import axios from 'axios'
import { AuthModel, UserModel } from './_models'

const API_URL = import.meta.env.VITE_API_BASE_URL

export const LOGIN_URL = `${API_URL}/auth/login`
export const VERIFY_TOKEN_URL = `${API_URL}/auth/verify`

// Sample login request
export function login(email: string, password: string): Promise<AuthModel & { user: UserModel }> {
  return axios.post(LOGIN_URL, {
    email,
    password,
  }).then((response) => response.data)
}

// Verify token request
export function getUserByToken(token: string): Promise<UserModel> {
  return axios.get(VERIFY_TOKEN_URL, {
    headers: { Authorization: `Bearer ${token}` }
  }).then((response) => response.data)
}
