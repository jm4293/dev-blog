import { BlogLogoImage } from '@/components/image';

interface PostCardHeaderProps {
  logoUrl: string | undefined;
  companyName: string;
  timeDisplay: string;
  children?: React.ReactNode;
}

export function PostCardHeader({ logoUrl, companyName, timeDisplay, children }: PostCardHeaderProps) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <BlogLogoImage
        logoUrl={logoUrl}
        companyName={companyName}
        width={32}
        height={32}
        className="rounded-lg object-cover"
        title={companyName}
        priority={false}
      />
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">{companyName}</p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{timeDisplay}</p>
      </div>
      {children}
    </div>
  );
}
