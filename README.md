# Zustands

- https://zustand.docs.pmnd.rs/getting-started/introduction
- zustand(불어 state) 로서 전역 상태관리
- Recoil 과 흡사하지만 Next.js 에서는 React 19로서 Recoil 지원안함.
- useState 는 컴포넌트 State, zustands 는 전역 State

## 1. 설치

```bash
npm install zustand
```

## 2. 카운터 테스트해 보기 예제

### 2.1. Store 의 타입 정의

- `/src/types 폴더` 생성
- `/src/types/types.ts 파일` 생성

```ts
// Counter Store 타입 정의
export interface CounterState {
  count: number; // 현재 카운터 값(숫자)
  increment: () => void; // 카운터 1증가
  decrement: () => void; // 카운터 1감소
  reset: () => void; // 카운터 0 초기화
  setCount: (count: number) => void; // 직접 카운터 값 설정
}
```

### 2.2. Store 구현하기

- `/src/stores 폴더` 생성
- `/src/stores/CounterStore.ts` 생성

```ts
// Counter Store - zustand 로 카운터 관리
// 1 단계 - store 타입 정의 (통상 types/types.ts 에 정의)
// interface CounterState {
//   count: number; // 현재 카운터 값(숫자)
//   increment: () => void; // 카운터 1증가
//   decrement: () => void; // 카운터 1감소
//   reset: () => void; // 카운터 0 초기화
//   setCount: (count: number) => void; // 직접 카운터 값 설정
// }

import { CounterState } from '@/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// 2 단계 - store 구현(필요시 localStorage 활용)
// create :  store 즉, state 만들기
// get : state 읽기
// set : state 쓰기
// const counterState = create((set, get) => ({
//   // 상태 (state)
//   count: 0,
//   // 상태를 바꾸는 함수(action)
//   increment: () => set(state => ({ count: state.count + 1 })),
// }));

// 2 단계 1. localStorage 가 적용 안된버전
const counterState = create<CounterState>()((set, get) => ({
  // 상태값 (state)
  count: 0,
  // 상태값 갱신(actions)
  increment: () => set(state => ({ count: state.count + 1 })),
  decrement: () => set(state => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
  setCount: (count: number) => set({ count }),
}));

// 2 단계 2. localStorage 가 적용된버전
const counterLocalState = create<CounterState>()(
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set(state => ({ count: state.count + 1 })),
      decrement: () => set(state => ({ count: state.count - 1 })),
      reset: () => set({ count: 0 }),
      setCount: (count: number) => set({ count }),
    }),
    { name: 'counter-storage' }
  )
);

// 3 단계 - custom Hook 정의
export const useCounterStore = () => {
  const { count, increment, decrement, reset, setCount } = counterLocalState();
  return { count, increment, decrement, reset, setCount };
};
```

### 2.3. 활용해보기

- `/src/components/Counter.tsx 파일` 생성

```tsx
/**
 * Counter 컴포넌트 - Zustand를 사용한 카운터 기능 구현
 *
 * 이 컴포넌트는 useCounterStore 훅을 사용하여 카운터 상태를 관리합니다.
 * 사용자가 버튼을 클릭하거나 직접 값을 입력하여 카운터를 조작할 수 있습니다.
 */

'use client';

import { useCounterStore } from '@/stores/CounterStore';

/**
 * Counter - 카운터 기능을 제공하는 React 컴포넌트
 *
 * Zustand의 useCounterStore 훅을 사용하여:
 * - 현재 카운터 값을 표시
 * - 증가/감소/리셋 버튼 제공
 * - 직접 값 입력 기능 제공
 *
 * @returns JSX.Element - 카운터 UI 컴포넌트
 */
export default function Counter() {
  // Zustand 스토어에서 상태와 액션들을 가져옵니다
  const { count, increment, decrement, reset, setCount } = useCounterStore();

  return (
    <div className='p-6 max-w-md mx-auto bg-white rounded-xl shadow-lg space-y-4'>
      {/* 컴포넌트 제목 */}
      <h2 className='text-2xl font-bold text-center text-gray-800'>
        Counter with Zustand
      </h2>

      <div className='text-center'>
        {/* 현재 카운터 값을 큰 글씨로 표시 */}
        <div className='text-4xl font-bold text-blue-600 mb-4'>{count}</div>

        {/* 카운터 조작 버튼들 */}
        <div className='space-x-2'>
          {/* 감소 버튼 - 클릭 시 decrement 액션 호출 */}
          <button
            onClick={decrement}
            className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors'
          >
            -1
          </button>

          {/* 증가 버튼 - 클릭 시 increment 액션 호출 */}
          <button
            onClick={increment}
            className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors'
          >
            +1
          </button>

          {/* 리셋 버튼 - 클릭 시 reset 액션 호출 */}
          <button
            onClick={reset}
            className='px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors'
          >
            Reset
          </button>
        </div>

        {/* 직접 값 입력 필드 */}
        <div className='mt-4'>
          <input
            type='number'
            value={count}
            onChange={e => setCount(Number(e.target.value))} // 입력값을 숫자로 변환하여 setCount 액션 호출
            className='w-20 px-2 py-1 border border-gray-300 rounded text-center'
          />
        </div>
      </div>
    </div>
  );
}
```

- `/src/app/page.tsx` 출력하기

```tsx
import ButtonTest from '@/components/ButtonTest';
import Counter from '@/components/Counter';
import SCSSTest from '@/components/SCSSTest';

export default function Home() {
  return (
    <div>
      <ButtonTest />
      <SCSSTest />
      <Counter />
    </div>
  );
}
```
