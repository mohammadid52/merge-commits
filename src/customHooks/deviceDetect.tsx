import { useState, useEffect } from 'react';

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [detectedDevice, setDetectedDevice] = useState<string>('');

  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? '' : window.navigator.userAgent;
    const mobileBoolean =
      userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i).length >
      0;

    setDetectedDevice(userAgent);
    setIsMobile(mobileBoolean);

    return () => console.log('UserAgent -> ', detectedDevice);
  }, []);

  return { device: detectedDevice, mobile: isMobile };
};

export default useDeviceDetect;
