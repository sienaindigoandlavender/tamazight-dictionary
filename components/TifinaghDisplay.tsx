interface TifinaghDisplayProps {
  text: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

const sizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
  '2xl': 'text-4xl',
  '3xl': 'text-5xl',
};

export default function TifinaghDisplay({ text, size = 'lg', className = '' }: TifinaghDisplayProps) {
  return (
    <span className={`tifinagh ${sizeClasses[size]} text-amazigh-gold ${className}`}>
      {text}
    </span>
  );
}
