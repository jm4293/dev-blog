import { memo } from 'react';
import { LucideIcon } from 'lucide-react';

interface ProfileInfoCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  isActive?: boolean;
}

export const ProfileInfoCard = memo(function ProfileInfoCard({
  icon: Icon,
  label,
  value,
  isActive = false,
}: ProfileInfoCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4 dark:bg-gray-900/50">
      <Icon
        className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
        }`}
      />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-gray-600 dark:text-gray-400">{label}</p>
        <p
          className={`truncate text-sm ${
            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
});
