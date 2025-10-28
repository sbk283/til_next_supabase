import { signInWithPassword } from '@/apis/auth';
import { UseMutationCallback } from '@/types/types';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export function useSignInWithPassword(callback?: UseMutationCallback) {
  return useMutation({
    mutationFn: signInWithPassword,
    // 자동으로 error 전달받음
    onError: error => {
      console.error(error);
      // Sonner 로 띄우기
      toast.error(error.message, { position: 'top-center' });

      if (callback?.onError) callback.onError(error);
    },
  });
}
