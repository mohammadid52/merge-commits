import {useState, useEffect} from 'react';

const useDeviceDetect = () => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [detectedDevice, setDetectedDevice] = useState<string>('');
  const [detectedBrowser, setDetectedBrowser] = useState<string>('');

  useEffect(() => {
    const userAgent = typeof navigator === 'undefined' ? '' : window.navigator.userAgent;
    const userAgentMatch = userAgent.match(
      /Android|BlackBerry|iPhone|iPod|Opera Mini|IEMobile|WPDesktop/i
    );
    const mobileBoolean = userAgentMatch === null ? false : true;

    /**
     * Below logic from developer.mozilla.org:
     *
     * https://developer.mozilla.org/en-US/docs/Web/API/Window/navigator
     */
    if (userAgent.indexOf('Firefox') > -1) {
      setDetectedBrowser('Mozilla Firefox');
      // "Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:61.0) Gecko/20100101 Firefox/61.0"
    } else if (userAgent.indexOf('SamsungBrowser') > -1) {
      setDetectedBrowser('Samsung Internet');
      // "Mozilla/5.0 (Linux; Android 9; SAMSUNG SM-G955F Build/PPR1.180610.011) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/9.4 Chrome/67.0.3396.87 Mobile Safari/537.36
    } else if (userAgent.indexOf('Opera') > -1 || userAgent.indexOf('OPR') > -1) {
      setDetectedBrowser('Opera');
      // "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36 OPR/57.0.3098.106"
    } else if (userAgent.indexOf('Trident') > -1) {
      setDetectedBrowser('Microsoft Internet Explorer');
      // "Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; .NET4.0C; .NET4.0E; Zoom 3.6.0; wbx 1.0.0; rv:11.0) like Gecko"
    } else if (userAgent.indexOf('Edge') > -1) {
      setDetectedBrowser('Microsoft Edge (Legacy)');
      // "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299"
    } else if (userAgent.indexOf('Edg') > -1) {
      setDetectedBrowser('Microsoft Edge (Chromium)');
      // Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.64
    } else if (userAgent.indexOf('Chrome') > -1) {
      setDetectedBrowser('Google Chrome or Chromium');
      // "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Ubuntu Chromium/66.0.3359.181 Chrome/66.0.3359.181 Safari/537.36"
    } else if (userAgent.indexOf('Safari') > -1) {
      setDetectedBrowser('Apple Safari');
      // "Mozilla/5.0 (iPhone; CPU iPhone OS 11_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0 Mobile/15E148 Safari/604.1 980x1306"
    } else {
      setDetectedBrowser('');
    }

    setDetectedDevice(userAgent);
    setIsMobile(mobileBoolean);

    // return () => console.log('UserAgent -> ', detectedDevice);
  }, []);

  return {browser: detectedBrowser, device: detectedDevice, mobile: isMobile};
};

export default useDeviceDetect;
