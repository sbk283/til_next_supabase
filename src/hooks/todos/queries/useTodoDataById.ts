import { fetchTodoById } from '@/apis/todo';
import { useQuery } from '@tanstack/react-query';

export function useTodoDataById(id: number) {
  return useQuery({
    queryKey: ['todo', id],
    queryFn: () => fetchTodoById(id),
    // 5초동안 fresh 유효 시간
    staleTime: 5000,
    // 10초동안 inactive 상태 지정
    gcTime: 10000,
  });
}
