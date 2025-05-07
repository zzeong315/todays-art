import React, { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useLoginMutation } from '../../queries/useAuthQuery.ts';
import Input from '../common/Input.tsx';
import { LoginData } from '../../types/auth.ts';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore.ts';

const LoginForm: React.FC = () => {
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';
  const { setIsLoggedIn } = useAuthStore();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const methods = useForm<LoginData>();
  const { mutate: login, isPending, isError } = useLoginMutation();

  const onSubmit = async (data: LoginData) => {
    console.log('data', data);
    setErrorMessage('');

    login(data, {
      onSuccess: () => {
        setIsLoggedIn(true);
        navigate(redirect, { replace: true });
      },
      onError: (err) => {
        const message = '로그인에 실패했습니다.';
        setErrorMessage(message);
        console.error('로그인 에러:', err);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto max-w-md">
        <Input
          name="email"
          label="이메일"
          type="email"
          placeholder="example@email.com"
          rules={{ required: '이메일을 입력해주세요.' }}
        />
        <Input
          name="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          rules={{ required: '비밀번호를 입력해주세요.' }}
        />
        <button
          type="submit"
          className="mt-4 w-full rounded bg-blue-500 p-2 text-white"
          disabled={isPending}
        >
          로그인
        </button>
      </form>
      {isError && <p className="text-red-500">{errorMessage}</p>}
    </FormProvider>
  );
};

export default LoginForm;
