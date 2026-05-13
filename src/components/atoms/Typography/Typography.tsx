interface TypographyProps {
  children: React.ReactNode;
  className?: string;
}

export function H1({ children, className = "" }: TypographyProps) {
  return (
    <h1 className={`text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl ${className}`}>
      {children}
    </h1>
  );
}

export function H2({ children, className = "" }: TypographyProps) {
  return (
    <h2 className={`text-2xl font-semibold text-gray-900 ${className}`}>
      {children}
    </h2>
  );
}

export function H3({ children, className = "" }: TypographyProps) {
  return (
    <h3 className={`text-lg font-medium text-gray-900 ${className}`}>
      {children}
    </h3>
  );
}

export function Paragraph({ children, className = "" }: TypographyProps) {
  return (
    <p className={`text-base text-gray-600 leading-relaxed ${className}`}>
      {children}
    </p>
  );
}
