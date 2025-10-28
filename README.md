# Supabase 구글 소셜 로그인

## 1. 개발자 사이트 등록 및 Supabase 세팅

```tsx
{
  /* 구글 소셜 로그인 */
}
<Button
  className='w-full cursor-pointer bg-blue-500'
  onClick={handleSignInWithKakao}
  disabled={isPendingKakao}
>
  구글 로그인
</Button>;
```

## 2. UI 작성

## 3. API 작성

- `/src/apis/auth.ts` 기능 재활용

```tsx
import type { Provider } from '@supabase/auth-js';
```

```tsx
// supabase 백엔드에 소셜 로그인
export async function signInWithOAuth(provider: Provider) {
  const { data, error } = await supabase.auth.signInWithOAuth({ provider });
  if (error) throw error;
  return data;
}
```

## 4. Mutation 작성

- `/src/hooks/mutations/useSignInWithGoogle.ts` 파일 생성

```tsx
import { signInWithOAuth } from '@/apis/auth';
import { useMutation } from '@tanstack/react-query';

export function useSignInWithGoogle() {
  return useMutation({
    mutationFn: signInWithOAuth,
  });
}
```

## 5. 활용하기

```tsx
// 구글 로그인
const { mutate: signInWithGoogle, isPending: isPendingGoogle } =
  useSignInWithKakao();
const handleSignInWithGoogle = () => {
  signInWithKakao('kakao');
};

{
  /* 구글 소셜 로그인 */
}
<Button
  className='w-full cursor-pointer bg-blue-500'
  onClick={handleSignInWithGoogle}
  disabled={isPendingGoogle}
>
  구글 로그인
</Button>;
```
