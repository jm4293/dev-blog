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
    <div className="flex items-start gap-3 rounded-lg bg-muted/50 p-4">
      <Icon className={`mt-0.5 h-5 w-5 flex-shrink-0 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`} />
      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-medium text-muted-foreground">{label}</p>
        <p className={`truncate text-sm ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>{value}</p>
      </div>
    </div>
  );
});
