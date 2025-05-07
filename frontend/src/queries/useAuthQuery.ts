import { login, register } from '../services/authService.ts';
import { useMutation } from '@tanstack/react-query';
import { LoginData, SignupData } from '../types/auth.ts';


export const useLoginMutation = () =>
  useMutation({
    mutationFn: (data: LoginData) =>
      login(data),
    onSuccess: (data) => {
      const { access_token, user } = data.data;
      console.log("login-user", user);
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      return access_token;
      alert("로그인 성공")
      window.location.href = "/";
    },
    onError: (error, variables, context) => {
      console.log("error", error)
      console.log("variables", variables)
      console.log("context", context)
    }
  });

export const useRegisterMutation = () =>
  useMutation({
    mutationFn: (data: SignupData) =>
      register(data),
    onSuccess: () => {
      alert("회원가입 성공")
    },
    onError: (error, variables, context) => {
      console.log("error", error)
      console.log("variables", variables)
      console.log("context", context)
    }
  });