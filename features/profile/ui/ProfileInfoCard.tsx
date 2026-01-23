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
    <div className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900/50">
      <Icon
        className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
          isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">{label}</p>
        <p
          className={`text-sm truncate ${
            isActive ? 'text-gray-900 dark:text-white' : 'text-gray-400 dark:text-gray-500'
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
});
