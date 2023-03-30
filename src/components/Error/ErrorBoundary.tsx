import {GlobalContext} from '@contexts/GlobalContext';
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
  authId?: string;
  email?: string;
  componentName: string;
  children?: React.ReactNode;
}

class ErrorBoundary extends React.Component<PropsInterface> {
  static contextType = GlobalContext;

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
    let context: any = this?.context || {state: {}};
    if (context && context?.state) {
      const {authId, email} = context?.state?.user;

      if (this.state.hasError) {
        logError(
          this.state.error.toString(),
          {authId: authId, email: email},
          this.props.componentName,
          this.state.info
        );
      }
    }
  }

  public render() {
    if (this.state.hasError) {
      console.error(this?.state?.error);

      return this?.props?.children || null;
    } else {
      return this?.props?.children || null;
    }
  }
}

export default ErrorBoundary;
