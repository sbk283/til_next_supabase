# 라우터 그룹으로 분기하기

- 사용자 권한별 라우터 분기하기

## 1. 회원을 위한 그룹생성

- `/src/app/(protected)` 폴더 생성

## 2. 비회원을 위한 그룹 생성

- `/src/app/(default)` 폴더 생성

## 3. 회원을 위한 그룹에 포함될 라우터

-아래의 파일은 모두 (protected} 폴더로 이동할 예정

- /
- /post/id
- profile
- reset-passwor

## 4. 비회원을 위한 그룹에 포함될 라우터

- 아래의 파일은 모두 (default) 폴더로 이동할 예정
- /forget-password
- /signup
- /signin

## 5. 인증된 사용자 접근 페이지

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const supabase = await createClient();
  // 세션 정보가 있는지 없는지 기다립니다.
  const { data } = await supabase.auth.getSession();
  console.log(data);
  // 세션정보를 가져왔는데 null 이 아니라면 회원이다.
  if (data.session) redirect('/');

  return <>{children}</>;
}
```

## 6. 인증되지 않은 사용자 접근 페이지

```tsx
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ProtectedLayoutProps {
  children: React.ReactNode;
}
export default async function ProtectedLayout({
  children,
}: ProtectedLayoutProps) {
  const supabase = await createClient();
  // 세션 정보가 있는지 없는지 기다립니다.
  const { data } = await supabase.auth.getSession();
  console.log(data);
  // 세션정보를 가져왔는데 null 이라면 비회원이다.
  if (!data.session) redirect('/signin');

  return <>{children}</>;
}
```
