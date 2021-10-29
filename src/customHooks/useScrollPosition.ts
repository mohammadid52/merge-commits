import {useEffect, useState} from 'react';
const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updatePosition = () => {
      console.log('updating...');
      setScrollPosition(window.pageYOffset);
    };
    $(window).on('scroll', updatePosition);
    updatePosition();
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);

  return scrollPosition;
};

export default useScrollPosition;
