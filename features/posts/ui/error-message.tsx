interface ErrorMessageProps {
  error: Error | unknown;
}

export function ErrorMessage({ error }: ErrorMessageProps) {
  const message = error instanceof Error ? error.message : '알 수 없는 오류';

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950">
      <p className="text-red-800 dark:text-red-200">오류가 발생했습니다: {message}</p>
    </div>
  );
}
