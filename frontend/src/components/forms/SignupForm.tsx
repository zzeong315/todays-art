import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import Input from '../common/Input.tsx';
import { SignupFormData } from '../../types/auth.ts';
import { useRegisterMutation } from '../../queries/useAuthQuery.ts';

// 예시: 비동기 이메일 중복 검사 함수
// const checkEmailDuplicate = async (email: string) => {
//   await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
//   const existingEmails = ['test@example.com', 'user@example.com'];
//   return !existingEmails.includes(email); // true면 사용 가능
// };

const ConfirmPasswordInput = () => {
  const {
    watch,
    formState: { errors },
    register,
  } = useFormContext<SignupFormData>();

  const password = watch('password');

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium text-gray-700">비밀번호 확인</label>
      <input
        type="password"
        {...register('confirmPassword', {
          required: '비밀번호 확인을 입력해주세요.',
          validate: (value) => value === password || '비밀번호가 일치하지 않습니다.',
        })}
        className={`w-full p-2 border rounded ${
          errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors.confirmPassword && (
        <p className="mt-1 text-sm text-red-500">{errors.confirmPassword.message}</p>
      )}
    </div>
  );
};

const SignupForm: React.FC = () => {
  const methods = useForm<SignupFormData>();
  const { mutate: signup, isPending } = useRegisterMutation();

  const onSubmit = async (data: SignupFormData) => {
    //console.log('회원가입 데이터:', data);

    const signupData = {
      email: data.email,
      nickname: data.nickname,
      password: data.password,
    }

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
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md mx-auto">
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
        <Input
          name="email"
          label="이메일"
          type="email"
          placeholder="your@email.com"
          rules={{
            required: '이메일을 입력해주세요.',
            // validate: async (value) =>
            //   (await checkEmailDuplicate(value)) || '이미 사용 중인 이메일입니다.',
          }}
        />
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
        <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded" disabled={isPending}>
          회원가입
        </button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;