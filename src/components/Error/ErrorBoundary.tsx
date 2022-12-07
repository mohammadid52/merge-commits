import {logError} from '@graphql/functions';
import React from 'react';

/**
 * Basis for this error boundary shamelessly
 * copied from "Balint" a.k.a. an "average front-end dev"
 * Source: https://abundancia.io/frontendmasters-intermediate-react/typing-an-error-boundary.html
 *
 * Non-typescript explanation can be found here:
 * https://reactjs.org/docs/error-boundaries.html
 *
 */
interface PropsInterface {
  fallback?: React.ReactNode;
  authId: string;
  email: string;
  componentName: string;
}

class ErrorBoundary extends React.Component<PropsInterface> {
  public state = {
    hasError: false,
    error: '',
    info: ''
  };

  constructor(props: PropsInterface) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
      info: ''
    };
  }

  public static getDerivedStateFromError() {
    return {hasError: true};
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error: error,
      info: info
    });
  }

  public componentDidUpdate() {
    if (this.state.hasError) {
      logError(
        this.state.error,
        {authId: this.props.authId, email: this.props.email},
        this.props.componentName
      );
      console.error('error logged to aws');
    }
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback;
    } else {
      return this.props.children;
    }
  }
}

export default ErrorBoundary;
