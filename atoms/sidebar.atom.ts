import { atom } from 'jotai';

/** 데스크톱 사이드바 호버 확장 상태 (본문 패딩 연동용) */
export const sidebarHoveredAtom = atom<boolean>(false);
