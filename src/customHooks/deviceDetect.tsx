import { useState, useEffect } from 'react';

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [detectedDevice, setDetectedDevice] = useState<string>('');

  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? '' : window.navigator.userAgent;
    const userAgentMatch = userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i);
    const mobileBoolean =
      userAgentMatch === null ? false : true;

    // console.log('detect: ', userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i))

    setDetectedDevice(userAgent);
    setIsMobile(mobileBoolean);

    return () => console.log('UserAgent -> ', detectedDevice);
  }, []);

  return { device: detectedDevice, mobile: isMobile };
};

export default useDeviceDetect;
