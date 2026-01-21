/**
 * URL query params 생성 유틸리티
 * falsy 값(undefined, null, empty string)은 자동으로 제외됩니다.
 *
 * @example
 * const params = buildQueryParams({
 *   page: 1,
 *   search: 'react',
 *   tags: '',  // 제외됨
 *   sort: undefined  // 제외됨
 * });
 * // 결과: page=1&search=react
 */
export function buildQueryParams(
  params: Record<string, string | number | boolean | undefined | null>,
): URLSearchParams {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.set(key, String(value));
    }
  });

  return searchParams;
}

/**
 * URLSearchParams에서 여러 파라미터를 한 번에 추출하는 유틸리티
 *
 * @example
 * const params = parseSearchParams(searchParams, {
 *   page: { default: 1, parse: (v) => parseInt(v, 10) },
 *   search: { default: '' },
 *   sort: { default: 'newest' as const },
 * });
 * // 결과: { page: 1, search: 'react', sort: 'newest' }
 */
export function parseSearchParams<T extends Record<string, any>>(
  searchParams: URLSearchParams,
  schema: {
    [K in keyof T]: {
      default: T[K];
      parse?: (value: string) => T[K];
    };
  },
): T {
  const result = {} as T;

  for (const [key, config] of Object.entries(schema)) {
    const value = searchParams.get(key);
    result[key as keyof T] = value ? (config.parse?.(value) ?? value) : config.default;
  }

  return result;
}
