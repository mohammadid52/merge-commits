import React from 'react';
import {classNames} from '../../FormElements/TextInput';

const AnimatedContainer = ({
  children,
  show,
  animationType = 'scale',
  duration = '300',
  className,
}: {
  show: boolean;
  className?: string;
  children: React.ReactNode;
  duration?: '150' | '200' | '300' | '500' | '700' | '1000';
  animationType?: 'slider' | 'opacity' | 'scale' | 'translateY';
}) => {
  const genAnimation = () => {
    switch (animationType) {
      case 'slider':
        return show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full';
      case 'opacity':
        return show ? 'opacity-100' : 'opacity-0';
      case 'scale':
        return show ? 'scale-100 opacity-100' : 'scale-95 opacity-0';
      case 'translateY':
        return show ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0';

      default:
        return show ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full';
    }
  };

  return (
    <div
      className={classNames(
        genAnimation(),
        'transition-all  transform',
        `duration-${duration}`,
        className
      )}>
      {children}
    </div>
  );
};

export default AnimatedContainer;
