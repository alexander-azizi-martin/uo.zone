import { log } from 'next-axiom';
import { type PropsWithChildren, Component } from 'react';

import { Layout } from '@/components/layout';
import { SearchNav } from '@/components/search';
import { Trans } from '@lingui/macro';

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  PropsWithChildren,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren) {
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
            <h2 className='mt-4'>
              <Trans>An error occurred.</Trans>
            </h2>
          </SearchNav>
        </Layout>
      );
    }

    return this.props.children;
  }
}
