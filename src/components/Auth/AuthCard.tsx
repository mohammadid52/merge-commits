import BrowserAlert from '@components/General/BrowserAlert';
import {MessageProps} from '@components/Message/Message';
import {useGlobalContext} from '@contexts/GlobalContext';
import useDeviceDetect from '@customHooks/deviceDetect';
import {getAsset} from 'assets';
import React, {ReactNode, useState} from 'react';
import {NavLink} from 'react-router-dom';

interface AuthCardProps {
  children: ReactNode;
  title?: string;
  message?: MessageProps;
}

const AuthCard = ({children, title, message}: AuthCardProps) => {
  const {browser: detectedBrowser} = useDeviceDetect();
  const [openAlertBrowser, setOpenAlertBrowser] = useState<boolean>(
    detectedBrowser === 'Safari'
  );

  const {clientKey} = useGlobalContext();

  return (
    <div className="w-full h-screen flex flex-row items-center justify-center bg-opacity-10 text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full md:max-w-160 max-w-9/10 sm:max-w-100 h-full max-h-160 flex flex-row rounded-xl shadow-2xl overflow-hidden">
        <div className="min-w-sm max-w-sm bg-white md:rounded-l-xl sm:rounded-xl">
          <div className="relative h-full flex flex-col items-center p-8 pt-12">
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
            <div className="h-auto mb-4 w-56">
              <img
                className=""
                src={getAsset(clientKey, 'login_page_logo')}
                alt="login_page_logo"
              />
            </div>
            {title && (
              <div className={`text-center mb-4 leading-5 text-lg  text-gray-500`}>
                <p>{title}</p>
              </div>
            )}
            <div>{children}</div>
            {message && (
              <p
                className={`text-xs text-center ${
                  message?.type === 'success'
                    ? 'text-green-500'
                    : message?.type === 'error'
                    ? 'text-red-500'
                    : null
                }`}>
                {message?.message}
              </p>
            )}
          </div>
        </div>
        <div
          className={` hidden md:block min-w-sm max-w-sm bg-gray-200 rounded-r-xl pr-0 ${getAsset(
            clientKey,
            'authBackground'
          )} bg-cover bg-center`}></div>
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
