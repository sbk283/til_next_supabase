# Zustand 와 Supabase Auth

## 1. 참조

- 수업인데 Supbase 계정이 2개라서 오류라면 아래부터 진행
- supabase 계정에 따라서 type 생성 오류발생함
- supabase 로그인 이후 진행

```bash
npx supabase login
```

## 2. `React` 와 `Next.js` 는 다르다.

- Supabase 는 `React 라면 localstorage 에 로그인 정보` 보관
- localstorage는 웹브라우저 종료해도 남아있어요.
- localstorage는 새로고침해도 남아있어요.
- localstorage는 유효기간이 없다.

- Supabase 는 `Next.js 라면 cookie 에 로그인 정보` 보관
- cookie는 웹브라우저 종료해도 남아있어요.
- cookie는 새로고침해도 남아있어요.
- cookie는 일정 기간만큼 보관(유효기간 존재)

## 3. zustand 로 관리하기

### 3.1. stores 만들기

- `/src/stores 폴더` 생성
- `/src/stores/session.ts 파일` 생성
- 단계 1.

```ts
import { create } from 'zustand';
create();
```

- 단계 2.

```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
create(combine());
```

- 단계 3.

```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';
create(combine(state 객체, 액션함수));
```

- 단계 4.

```ts
// 보관할 state의 객체의 초기값
const initialState = {
  isLoading: false,
  session: null,
};

create(combine(initialState, 액션함수));
```

- 단계 5.

```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

// Supabase 의 인증의 타입을 정의함
import type { Session } from '@supabase/supabase-js';
type State = {
  isLoading: boolean;
  session: null | Session;
};
// 보관할 state의 객체의 초기값
const initialState = {
  isLoading: false,
  session: null,
} as State;

create(combine(initialState, 액션함수));
```

- 단계 6.

```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

// Supabase 의 인증의 타입을 정의함
import type { Session } from '@supabase/supabase-js';
type State = {
  isLoading: boolean;
  session: null | Session;
};
// 보관할 state의 객체의 초기값
const initialState = {
  isLoading: false,
  session: null,
} as State;

create(combine(initialState, () => 액션객체));
```

- 단계 7.

```ts
import { create } from 'zustand';
import { combine } from 'zustand/middleware';

// Supabase 의 인증의 타입을 정의함
import type { Session } from '@supabase/supabase-js';
type State = {
  isLoading: boolean;
  session: null | Session;
};
// 보관할 state의 객체의 초기값
const initialState = {
  isLoading: false,
  session: null,
} as State;

create(combine(initialState, () => ({ 키명: 기능 })));
```

- 단계 8.

```ts
create(combine(initialState, () => ({ actions: {} })));
```

- 단계 9.

```ts
// set 은 state 값 설정
// get 은 state 값 읽기
create(combine(initialState, (set, get) => ({ actions: {} })));
```

- 단계 10.

```ts
// set 은 state 값 설정
// get 은 state 값 읽기
create(
  combine(initialState, (set, get) => ({
    actions: {
      setSession: () => {
        // 하고싶은일
      },
    },
  }))
);
```

- 단계 11.

```ts
// set 은 state 값 설정
// get 은 state 값 읽기
create(
  combine(initialState, (set, get) => ({
    actions: {
      setSession: (session: Session | null) => {
        // 하고싶은일
        set({ isLoading: true, session });
      },
    },
  }))
);
```

### 3.2. devtools 로 개발을 편하게 처리

- 단계 1.

```ts
import { combine, devtools } from 'zustand/middleware';
```

- 단계 2.

```ts
create(devtools());
```

- 단계 3.

```ts
create(devtools(combine함수, { name: 'sessionStore' }));
```

- 단계 4.

```ts
create(
  devtools(
    combine(initialState, (set, get) => ({
      actions: {
        setSession: (session: Session | null) => {
          // 하고싶은일
          set({ isLoading: true, session });
        },
      },
    })),
    { name: 'sessionStore' }
  )
);
```

### 3.3. 커스터 훅으로 뽑아주기

- 단계 1.

```ts
const useSessionStore = create(
  devtools(
    combine(initialState, (set, get) => ({
      actions: {
        setSession: (session: Session | null) => {
          // 하고싶은일
          set({ isLoading: true, session });
        },
      },
    })),
    { name: 'sessionStore' }
  )
);
```

- Session 정보만 추출하는 커스텀 훅

```ts
// session 정보
export const useSession = () => {
  // Selector 함수는 Store 에서 원하는 것을 선택해서 리턴한다.
  const session = useSessionStore(store => store.session);
  return session;
};
```

- loading 정보만 추출하는 커스텀 훅

```ts
// loading 정보
export const useSessionLoaded = () => {
  // Selector 함수는 Store 에서 원하는 것을 선택해서 리턴한다.
  const isSessionLoaded = useSessionStore(store => store.isLoading);
  return isSessionLoaded;
};
```

- setSession 액션만 추출하는 커스텀 훅

```ts
// sesstion 보관 액션
export const useSetSession = () => {
  // Selector 함수는 Store 에서 원하는 것을 선택해서 리턴한다.
  const setSession = useSessionStore(store => store.actions.setSession);
  return setSession;
};
```
