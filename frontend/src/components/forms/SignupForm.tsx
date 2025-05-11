import React, { useState } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import Input from '../common/Input.tsx';
import { SignupFormData } from '../../types/auth.ts';
import { useRegisterMutation } from '../../queries/useAuthQuery.ts';
import publicApi from '../../api/publicApi.ts';

export const checkEmailDuplicate = async (email: string): Promise<boolean> => {
  const response = await publicApi(`/auth/check-email?email=${encodeURIComponent(email)}`);
  const data = response.data;
  return !data.isTaken;
};

const ConfirmPasswordInput = () => {
  const {
    watch,
    formState: { errors },
    register,
  } = useFormContext<SignupFormData>();

  const password = watch('password');

  return (
    <div className="mb-4">
      <label className="mb-1 block font-medium text-gray-700">비밀번호 확인</label>
      <input
        type="password"
        placeholder="비밀번호 입력"
        {...register('confirmPassword', {
          required: '비밀번호 확인을 입력해주세요.',
          validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
        })}
        className={`w-full rounded border p-2 ${
          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.confirmPassword && (
        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
      )}
    </div>
  );
};

interface EmailInputProps {
  isEmailChecked: boolean;
  onCheckEmail: () => void;
}

const EmailInput = ({ isEmailChecked, onCheckEmail }: EmailInputProps) => {
  const {
    formState: { errors },
    register,
  } = useFormContext<SignupFormData>();

  return (
    <div className="mb-4">
      <div className={'flex items-end justify-between space-x-4'}>
        <div className={'w-full'}>
          <label className="mb-1 block font-medium text-gray-700">이메일</label>
          <input
            type="email"
            placeholder="your@email.com"
            {...register('email', {
              required: '이메일을 입력해주세요.',
            })}
            className={`w-full rounded border p-2 ${
              errors.email?.message ? 'border-red-500' : 'border-gray-300'
            }`}
          />
        </div>
        <button
          type="button"
          onClick={onCheckEmail}
          className="h-10 shrink-0 rounded bg-gray-200 px-3 text-sm"
        >
          중복 확인
        </button>
      </div>

      {errors.email?.message && !isEmailChecked && (
        <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
      )}
      {isEmailChecked && <p className="mt-1 text-sm text-blue-500">사용 가능한 이메일입니다.</p>}
    </div>
  );
};

const SignupForm: React.FC = () => {
  const methods = useForm<SignupFormData>();
  const { mutate: signup, isPending } = useRegisterMutation();
  const { watch, setError, clearErrors } = methods;
  const [isEmailChecked, setIsEmailChecked] = useState(false);

  const onCheckEmail = async () => {
    const email = watch('email');
    if (!email) return;

    const available = await checkEmailDuplicate(email);
    if (available) {
      setIsEmailChecked(true);
      // setEmailCheckMessage('사용 가능한 이메일입니다.');
      clearErrors('email');
    } else {
      setIsEmailChecked(false);
      // setEmailCheckMessage('이미 사용 중인 이메일입니다.');
      setError('email', { type: 'manual', message: '이미 사용 중인 이메일입니다.' });
    }
  };

  const onSubmit = async (data: SignupFormData) => {
    if (!isEmailChecked) {
      alert('이메일 중복 확인을 해주세요.');
      return;
    }

    const signupData = {
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    };

    try {
      const response = await signup(signupData); // 성공 시 응답 받기
      console.log('회원가입 성공:', response);
      // // 예: 페이지 이동, 토스트 알림 등
      // alert('회원가입 완료!');
    } catch (err: any) {
      const message = err?.response?.data?.message || '회원가입에 실패했습니다.';
      alert(message);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="mx-auto max-w-md">
        <Input
          name="nickname"
          label="이름"
          type="text"
          placeholder="이름"
          rules={{
            required: '원하는 이름을 입력해주세요.',
            minLength: { value: 2, message: '2자 이상 입력해주세요.' },
          }}
        />
        {/*<div>*/}
        {/*  <div className={'flex items-center justify-between'}>*/}
        {/*    <Input*/}
        {/*      name="email"*/}
        {/*      label="이메일"*/}
        {/*      type="email"*/}
        {/*      placeholder="your@email.com"*/}
        {/*      rules={{*/}
        {/*        required: '이메일을 입력해주세요.',*/}
        {/*      }}*/}
        {/*    />*/}
        {/*    <button*/}
        {/*      type="button"*/}
        {/*      onClick={onCheckEmail}*/}
        {/*      className="h-10 rounded bg-gray-200 px-3 text-sm"*/}
        {/*    >*/}
        {/*      중복 확인*/}
        {/*    </button>*/}
        {/*  </div>*/}
        {/*</div>*/}
        <EmailInput isEmailChecked={isEmailChecked} onCheckEmail={onCheckEmail} />

        <Input
          name="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호 입력"
          rules={{
            required: '비밀번호를 입력해주세요.',
            minLength: { value: 6, message: '6자 이상 입력해주세요.' },
          }}
        />
        <ConfirmPasswordInput />
        <button
          type="submit"
          className="mt-4 w-full rounded bg-blue-500 p-2 text-white"
          disabled={isPending}
        >
          회원가입
        </button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;
