import BrowserAlert from 'components/General/BrowserAlert';
import {MessageProps} from 'components/Message/Message';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDeviceDetect from 'customHooks/deviceDetect';
import {getAsset} from 'assets';
import React, {ReactNode, useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import gsap from 'gsap';

interface AuthCardProps {
  children: ReactNode;
  subtitle?: string;
  title?: string;
  message?: MessageProps;
  isSuccess?: boolean;
}

const AuthCard = ({children, title, message, isSuccess, subtitle}: AuthCardProps) => {
  const {browser: detectedBrowser} = useDeviceDetect();
  const [openAlertBrowser, setOpenAlertBrowser] = useState<boolean>(
    detectedBrowser === 'Safari'
  );

  const {clientKey} = useGlobalContext();

  useEffect(() => {
    if (isSuccess) {
      // setTimeout(() => {
      const el = document.getElementsByClassName('auth-card')[0];
      if (el) {
        gsap.to(el, {
          delay: 1,
          duration: 1,
          y: '-200%',
          scale: 0.5,
          opacity: 0
        });
      }
      // }, 4000);
    }
  }, [isSuccess]);

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full auth-card m-8 md:max-w-256  max-w-9/10 sm:max-w-100 h-full max-h-160 flex flex-row  customShadow rounded-xl overflow-hidden">
        {/* Left image starts here */}
        <div
          className={` hidden  md:block min-w-sm max-w-sm bg-gray-200  pr-0 ${getAsset(
            clientKey,
            'authBackground'
          )} bg-cover bg-center`}></div>
        {/* Left image ends here */}
        {/* Right image starts here */}
        <div className=" bg-white   flex items-center justify-center">
          <div className="relative h-full flex flex-col justify-center items-center p-8 w-8/10">
            <div className="h-auto mb-4">
              <img
                className=""
                src={getAsset(clientKey, 'login_page_logo')}
                alt="login_page_logo"
              />
            </div>
            {title && (
              <h3 className="text-left mt-4 mb-1 leading-5 text-lg  text-black font-medium tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && <h6 className="mb-4 text-sm  text-gray-500">{subtitle}</h6>}
            <div>{children}</div>
            {message && (
              <p
                className={`my-2 text-xs text-center ${
                  message?.type === 'success'
                    ? 'text-green-500'
                    : message?.type === 'error'
                    ? 'text-red-500'
                    : null
                }`}>
                {message?.message}
              </p>
            )}
            <div
              className={`absolute bottom-0 text-center mb-4 leading-5 text-xs text-gray-600`}>
              <p>© Copyright {new Date().getFullYear()}</p>
              <p>
                <NavLink
                  className="underline text-xs hover:text-blue-500"
                  to="/privacy-policy">
                  Privacy Policy
                </NavLink>
              </p>
            </div>
          </div>
        </div>
        {/* Right image ends here */}
      </div>
      {openAlertBrowser && (
        <BrowserAlert
          alert={openAlertBrowser}
          closeTab={() => {
            window.open('', '_parent', '');
            window.close();
          }}
          onContinue={() => setOpenAlertBrowser(false)}
        />
      )}
    </div>
  );
};

export default AuthCard;
