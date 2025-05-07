import React from 'react';
import { useFormContext, RegisterOptions } from 'react-hook-form';

interface InputProps {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  rules?: RegisterOptions;
}

const Input: React.FC<InputProps> = ({ name, label, type = 'text', placeholder, rules }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-4">
      <label htmlFor={name} className="block mb-1 font-medium text-gray-700">
        {label}
      </label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        {...register(name, rules)}
        className={`w-full p-2 border rounded ${
          errors[name] ? 'border-red-500' : 'border-gray-300'
        }`}
      />
      {errors[name] && (
        <p className="mt-1 text-sm text-red-500">{(errors[name]?.message as string) || '입력 오류'}</p>
      )}
    </div>
  );
};

export default Input;