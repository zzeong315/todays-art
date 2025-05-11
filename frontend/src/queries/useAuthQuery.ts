import { login, register } from '../services/authService.ts';
import { useMutation } from '@tanstack/react-query';
import { LoginData, SignupData } from '../types/auth.ts';

export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginData) => login(data),
    onSuccess: (data) => {
      const { accessToken, user } = data.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('user', JSON.stringify(user));
      return accessToken;
    },
    onError: (error, variables, context) => {
      console.log('error', error);
      console.log('variables', variables);
      console.log('context', context);
    },
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: SignupData) => register(data),
    onSuccess: () => {
      alert('회원가입 성공');
    },
    onError: (error, variables, context) => {
      console.log('error', error);
      console.log('variables', variables);
      console.log('context', context);
    },
  });
