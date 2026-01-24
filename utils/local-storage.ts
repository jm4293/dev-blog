/**
 * localStorage에 데이터 저장
 * @param key - 저장할 키
 * @param value - 저장할 값 (자동으로 JSON.stringify)
 */
export function setLocalStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {}
}

/**
 * localStorage에서 데이터 조회
 * @param key - 조회할 키
 * @param defaultValue - 값이 없을 때 반환할 기본값
 * @returns 저장된 값 또는 기본값
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T) : defaultValue;
  } catch (error) {
    return defaultValue;
  }
}

/**
 * localStorage에서 데이터 삭제
 * @param key - 삭제할 키
 */
export function removeLocalStorage(key: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(key);
  } catch (error) {}
}

/**
 * localStorage 전체 초기화
 */
export function clearLocalStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.clear();
  } catch (error) {}
}
