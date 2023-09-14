import { useQueryErrorResetBoundary } from '@tanstack/react-query';
import ErrorBoundary from '@/components/error-boundary/ErrorBoundary';
import { ComponentProps, Suspense } from 'react';
import { useRouter } from 'next/router';

type ErrorBoundaryProps = ComponentProps<typeof ErrorBoundary>;

type Props = ErrorBoundaryProps & {
  children: React.ReactNode;
  pendingFallback?: React.ReactNode;
};

function ApiErrorBoundary({ children, pendingFallback, resetKeys, ...props }: Props) {
  const { reset } = useQueryErrorResetBoundary();
  const pathname = useRouter().pathname;

  return (
    <ErrorBoundary onReset={reset} resetKeys={[resetKeys ? resetKeys : pathname]} {...props}>
      <Suspense fallback={pendingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default ApiErrorBoundary;
