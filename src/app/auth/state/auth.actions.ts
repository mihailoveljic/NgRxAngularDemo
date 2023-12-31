import { createAction, props } from "@ngrx/store";
import { User } from "../models/User.model";

export const LOGIN_START = '[auth page] login start';
export const LOGIN_SUCCESS = '[auth page] login success';
export const SIGNUP_START = '[auth page] signup start';
export const SIGNUP_SUCCESS = '[auth page] signup success';
export const AUTO_LOGIN = '[auth page] auto login';
export const AUTO_LOGOUT = '[auth page] auto logout';

export const loginStart = createAction(
  LOGIN_START,
  props<{email:string; password:string}>()
)
export const signupStart = createAction(
  SIGNUP_START,
  props<{email:string; password:string}>()
)
export const loginSuccess = createAction(LOGIN_SUCCESS, props<{user: User; redirect: boolean}>());
export const signupSuccess = createAction(SIGNUP_SUCCESS, props<{user: User}>());
export const autoLogin = createAction(AUTO_LOGIN);
export const autoLogout = createAction(AUTO_LOGOUT);
