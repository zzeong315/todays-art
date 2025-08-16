import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog.tsx';

interface ChangePasswordModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChangePasswordModal = ({ open, onOpenChange }: ChangePasswordModalProps) => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data: any) => {
    // 비밀번호 변경 로직
    console.log(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>비밀번호 변경</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4">
          <input
            type="password"
            placeholder="현재 비밀번호"
            {...register('currentPassword')}
            className="w-full rounded border p-2"
          />
          <input
            type="password"
            placeholder="새 비밀번호"
            {...register('newPassword')}
            className="w-full rounded border p-2"
          />
          <input
            type="password"
            placeholder="새 비밀번호 확인"
            {...register('confirmPassword')}
            className="w-full rounded border p-2"
          />
          <button type="submit" className="w-full rounded bg-blue-600 py-2 text-white">
            변경하기
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ChangePasswordModal;
