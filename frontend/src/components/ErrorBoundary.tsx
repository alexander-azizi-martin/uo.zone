import { log } from 'next-axiom';
import { useTranslations } from 'next-intl';
import React from 'react';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  tError: ReturnType<typeof useTranslations<string>>;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundaryClass extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, errorInfo: unknown) {
    log.error('Client Side Error', {
      error,
      errorInfo,
      url: window.location.href,
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <Layout>
          <SearchNav>
            <h2 className='mt-4'>{this.props.tError('client')}</h2>
          </SearchNav>
        </Layout>
      );
    }

    return this.props.children;
  }
}

function withErrorTranslations(
  Component: React.ComponentType<ErrorBoundaryProps>,
) {
  return function WrappedComponent(props: Omit<ErrorBoundaryProps, 'tError'>) {
    const tError = useTranslations('Error');
    return <Component {...props} tError={tError} />;
  };
}

export const ErrorBoundary = withErrorTranslations(ErrorBoundaryClass);
