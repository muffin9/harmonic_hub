interface LoadingSkeletonProps {
  variant?: 'button' | 'text' | 'header';
  className?: string;
}

export function LoadingSkeleton({
  variant = 'button',
  className = '',
}: LoadingSkeletonProps) {
  const baseClasses = 'bg-gray-200 rounded animate-pulse';

  switch (variant) {
    case 'button':
      return <div className={`w-16 h-8 ${baseClasses} ${className}`} />;

    case 'text':
      return <div className={`w-20 h-4 ${baseClasses} ${className}`} />;

    case 'header':
      return (
        <div className={`flex items-center gap-3 ${className}`}>
          <div className={`w-20 h-4 ${baseClasses}`} />
          <div className={`w-16 h-8 ${baseClasses}`} />
        </div>
      );

    default:
      return <div className={`w-16 h-8 ${baseClasses} ${className}`} />;
  }
}
