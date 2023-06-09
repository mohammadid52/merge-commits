import Buttons from '@components/Atoms/Buttons';
import AnimatedContainer from '@components/Lesson/UniversalLessonBuilder/UI/UIComponents/Tabs/AnimatedContainer';
import {getClientKey} from '@utilities/strings';
import {Typography} from 'antd';
import {getAsset} from 'assets';
import BrowserAlert from 'components/General/BrowserAlert';
import {useGlobalContext} from 'contexts/GlobalContext';
import useDeviceDetect from 'customHooks/deviceDetect';
import gsap from 'gsap';
import {ReactNode, useEffect, useState} from 'react';
import {NavLink, useHistory} from 'react-router-dom';

interface AuthCardProps {
  children: ReactNode;
  subtitle?: string;
  title?: string;
  message?: any;
  showFooter?: boolean;
  isSuccess?: boolean;
  setPasswordComponent?: ReactNode;
}

const AuthCard = ({
  children,
  showFooter = true,
  title,
  message,
  isSuccess,
  subtitle,
  setPasswordComponent = null
}: AuthCardProps) => {
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
          // scale: 0.5,
          opacity: 0
        });
      }
      // }, 4000);
    }
  }, [isSuccess]);

  const history = useHistory();

  return (
    <div className="w-full  h-screen flex flex-row items-center justify-center text-sm md:bg-none sm:bg-cover sm:bg-center">
      <div className="w-full   z-100 auth-card m-8 md:max-w-256  max-w-9/10 sm:max-w-100 h-full max-h-160 flex flex-row  customShadow rounded-xl overflow-hidden">
        {/* Left image starts here */}
        <div
          className={` hidden  w-full md:block min-w-sm max-w-sm bg-lightest  pr-0 ${getAsset(
            clientKey,
            'authBackground'
          )} bg-cover bg-center`}></div>
        {/* Left image ends here */}
        {/* Right image starts here */}
        <div className=" bg-white p-8  flex items-center justify-center">
          <div className="relative h-full transition-all  flex flex-col justify-center items-center ">
            {showFooter && (
              <div className="h-auto mb-4 transition-all ">
                <img
                  className={clientKey === 'curate' ? 'h-[7rem]' : ''}
                  src={getAsset(clientKey, 'login_page_logo')}
                  alt="login_page_logo"
                />
              </div>
            )}
            {title && (
              <h3 className="transition-all text-left mt-4 mb-1 leading-5 text-lg  text-black font-medium tracking-wide">
                {title}
              </h3>
            )}
            {subtitle && (
              <h6
                className={`px-2 capitalize transition-all mb-4 text-sm  ${
                  subtitle.split(' ').length > 10 ? 'text-left' : 'text-center'
                } text-medium `}>
                {subtitle}
              </h6>
            )}
            <div className="w-full">{children}</div>
            {setPasswordComponent}
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
          </div>
        </div>

        {/* Right image ends here */}
      </div>
      <AnimatedContainer
        className="absolute flex w-full items-center justify-center bottom-1"
        show={showFooter && !isSuccess}>
        {showFooter && !isSuccess && (
          <div className={`text-center flex leading-5 text-xs text-medium `}>
            <Typography.Text className="mr-2" type="secondary">
              © Copyright <strong className="capitalize">{getClientKey()}</strong>{' '}
              {new Date().getFullYear()} All Rights Reserved |
            </Typography.Text>
            <NavLink to={'/privacy-policy'}>
              <Typography.Text className="text-blue-500 hover:underline cursor-pointer">
                Privacy Policy
              </Typography.Text>
            </NavLink>

            {/* <Buttons
              label={''}
              variant="link"
              onClick={() => history.push('/privacy-policy')}
            /> */}
          </div>
        )}
      </AnimatedContainer>
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
