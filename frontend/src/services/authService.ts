import publicApi from '../api/publicApi.ts';
import { LoginData, SignupData } from '../types/auth.ts';

export const login = (data: LoginData) => publicApi.post('/auth/login', data);

export const register = (data: SignupData) => publicApi.post('/auth/signup', data);
