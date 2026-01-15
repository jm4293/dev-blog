import { atom } from 'jotai';
import type { User } from '@supabase/auth-js';

// 현재 로그인한 사용자
export const userAtom = atom<User | null>(null);

// 인증 로딩 상태
export const isAuthLoadingAtom = atom<boolean>(true);

// 인증 에러
export const authErrorAtom = atom<Error | null>(null);
