import {getAsset} from 'assets';
import {useGlobalContext} from 'contexts/GlobalContext';
import React from 'react';
import {VscSmiley} from 'react-icons/vsc';
interface MobileOops {
  userAgent: string;
}

const MobileOops: React.FC<MobileOops> = (props: MobileOops) => {
  const {clientKey} = useGlobalContext();
  return (
    <div className="fixed w-screen h-screen flex items-center justify-center bg-light-gray bg-opacity-20 p-4 rounded-xl">
      <div className="h-1/2 max-h-80 max-w-80 my-auto mx-auto shadow-xl rounded-xl">
        <div className="h-2.5/10 bg-dark-gray border-b-0 border-dark-red p-4 rounded-t-xl">
          <img
            id="dashboard"
            className="h-full mx-auto"
            src={getAsset(clientKey, 'main_logo')}
            alt="Iconoclast Artists"
          />
        </div>
        <div className="w-full h-7.5/10 flex flex-col px-4 pb-4 bg-white rounded-b-xl">
          <div className="h-auto w-auto my-auto">
            <p className="text-dark-gray text-center text-lg">
              Classes are currently only available on PC / Laptop...
            </p>

            <div className="w-full mx-auto flex justify-center">
              <VscSmiley color="#0b0b0b" size={'2rem'} />
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-auto mb-0">
            Your device: {props.userAgent}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MobileOops;
