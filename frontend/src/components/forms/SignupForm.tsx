import React from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import Input from '../common/Input.tsx';

// 예시: 비동기 이메일 중복 검사 함수
const checkEmailDuplicate = async (email: string) => {
  await new Promise((resolve) => setTimeout(resolve, 500)); // simulate delay
  const existingEmails = ['test@example.com', 'user@example.com'];
  return !existingEmails.includes(email); // true면 사용 가능
};

interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

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

  const onSubmit = (data: SignupFormData) => {
    console.log('회원가입 데이터:', data);
    alert('회원가입 완료!');
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="max-w-md mx-auto">
        <Input
          name="email"
          label="이메일"
          type="email"
          placeholder="your@email.com"
          rules={{
            required: '이메일을 입력해주세요.',
            validate: async (value) =>
              (await checkEmailDuplicate(value)) || '이미 사용 중인 이메일입니다.',
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
        <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded">
          회원가입
        </button>
      </form>
    </FormProvider>
  );
};

export default SignupForm;