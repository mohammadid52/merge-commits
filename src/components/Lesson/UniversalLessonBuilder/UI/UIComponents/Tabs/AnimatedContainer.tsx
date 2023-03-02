import ErrorBoundary from '@components/Error/ErrorBoundary';
import React from 'react';

const AnimatedContainer = ({
  children,
  show,
  animationType = 'scale',
  duration = '300',
  className,
  customAnimation,
  fixWidth = false,
  delay = '0s',
  zIndex,
  style = {}
}: {
  show: boolean;
  fixWidth?: boolean;
  zIndex?: number;
  style?: any;
  className?: string;
  delay?: string;
  customAnimation?: {show: string; hide: string};
  children: React.ReactNode;
  duration?: '150' | '200' | '300' | '500' | '700' | '1000' | string;
  animationType?: 'slider' | 'opacity' | 'scale' | 'translateY' | 'sliderInvert' | string;
}) => {
  const genAnimation = () => {
    switch (animationType) {
      case 'slider':
        return show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full';
      case 'sliderInvert':
        return show ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full';

      case 'opacity':
        return show ? 'opacity-100' : 'opacity-0';
      case 'scale':
        return show ? 'scale-100 opacity-100' : 'scale-95 opacity-0';
      case 'translateY':
        return show ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0';
      case 'custom':
        return show ? customAnimation.show : customAnimation.hide;

      default:
        return show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full';
    }
  };
  return (
    <ErrorBoundary componentName="AnimatedContainer">
      <div
        style={{transitionDelay: delay, ...style}}
        className={`
        ${genAnimation()}
        transition-all  transform
        duration-${duration}
        ${fixWidth ? (show ? className : 'w-0') : className}
      `}>
        {children}
      </div>
    </ErrorBoundary>
  );
};

export default AnimatedContainer;
