import { User } from "../models/User.model"

export interface AuthState{
  user: User|null
}

export const initialState: AuthState = {
  user: null
}
