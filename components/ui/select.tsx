'use client';

import { ReactNode, useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/utils';
import { Check, ChevronDown } from 'lucide-react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

interface SelectProps<T extends string = string> {
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  ariaLabel?: string;
  placeholder?: string;
  className?: string;
  menuClassName?: string;
  disabled?: boolean;
}

export function Select<T extends string = string>({
  value,
  onChange,
  options,
  ariaLabel,
  placeholder,
  className,
  menuClassName,
  disabled = false,
}: SelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(() =>
    Math.max(
      options.findIndex((option) => option.value === value),
      0,
    ),
  );
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listboxId = useId();

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const openMenu = () => {
    const index = options.findIndex((option) => option.value === value);
    setActiveIndex(index >= 0 ? index : 0);
    setIsOpen(true);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      setActiveIndex((prev) => (prev + 1) % options.length);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      setActiveIndex((prev) => (prev - 1 + options.length) % options.length);
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      const next = options[activeIndex];
      if (next) {
        onChange(next.value);
        setIsOpen(false);
      }
    }
  };

  return (
    <div ref={containerRef} className={cn('relative inline-block', className)}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => {
          if (disabled) return;
          if (isOpen) {
            setIsOpen(false);
          } else {
            openMenu();
          }
        }}
        onKeyDown={handleKeyDown}
        className="glass-card flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg px-3 py-3 font-medium text-foreground transition-colors hover:bg-muted/60 disabled:cursor-not-allowed disabled:opacity-50 md:px-4"
      >
        <span className={cn(!selectedOption && 'text-muted-foreground')}>
          {selectedOption?.label ?? placeholder ?? '선택'}
        </span>
        <ChevronDown className={cn('h-5 w-5 transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <ul
          id={listboxId}
          role="listbox"
          aria-label={ariaLabel}
          className={cn(
            'glass-modal absolute right-0 z-50 mt-2 min-w-full overflow-hidden rounded-lg border border-border py-1 shadow-lg',
            menuClassName,
          )}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  triggerRef.current?.focus();
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm text-foreground transition-colors',
                  isActive && 'bg-muted/60',
                  isSelected && 'font-medium',
                )}
              >
                <span className="whitespace-nowrap">{option.label}</span>
                {isSelected && <Check className="h-4 w-4" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
