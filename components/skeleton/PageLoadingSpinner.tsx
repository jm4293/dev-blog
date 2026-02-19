interface PageLoadingSpinnerProps {
  overlay?: boolean;
}

export function PageLoadingSpinner({ overlay = false }: PageLoadingSpinnerProps) {
  const content = (
    <div className="flex items-center gap-1">
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.4s]">d</span>
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.3s]">e</span>
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.2s]">v</span>
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.1s]">B</span>
      <span className="animate-pulse-fast text-2xl font-bold text-muted-foreground">l</span>
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.05s]">o</span>
      <span className="animate-pulse-fast text-2xl font-bold text-foreground [animation-delay:-0.1s]">g</span>
    </div>
  );

  if (overlay) {
    return (
      <div className="fixed inset-x-0 bottom-0 top-16 z-30 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return <div className="flex h-screen items-center justify-center">{content}</div>;
}
