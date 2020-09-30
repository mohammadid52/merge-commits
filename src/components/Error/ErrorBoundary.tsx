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
  test?: 'test';
}

class ErrorBoundary extends React.Component {
  public state = {
    hasError: false,
    error: '',
    info: ''
  }

  constructor(props: PropsInterface) {
    super(props);
    this.state = {
      hasError: false,
      error: '',
      info: '',
    };
  }

  public static getDerivedStateFromError() {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    this.setState({
      hasError: true,
      error: error,
      info: info,
    });
  }

  public componentDidUpdate() {
    if (this.state.hasError) {
      console.log('error found in boundary');
    }
  }
  
  public render() {
    if (this.state.hasError) {
      return (
        <div className='w-full h-full flex flex-column justify-center items-center bg-dark rounded-lg'>
          <p className='text-center text-white'>
            Dang it! Check the console for more info about this error...
          </p>
          <p className='text-center text-white'>
            {
              this.state.error
            }
            <br/>
            {
              this.state.info
            }
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
