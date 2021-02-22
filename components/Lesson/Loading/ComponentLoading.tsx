import React, { useContext } from 'react';
import { GlobalContext } from '../../../contexts/GlobalContext';
import { getAsset } from '../../../assets';
import useDictionary from '../../../customHooks/dictionary';
const ComponentLoading = () => {
  const { clientKey, userLanguage } = useContext(GlobalContext);
  const { appDict } = useDictionary(clientKey);
  return (
    <div className='min-h-screen h-screen w-full text-gray-200 font-open font-light flex flex-col justify-center items-center'>
      <div className='relative w-full mb-4 pb-4 flex flex-col justify-center items-center rounded-lg'>
        <div
          className={`w-64 h-48 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-white rounded-t-lg`}>
          <img
            src={getAsset(clientKey, 'loading_logo')}
            alt={`${clientKey} Logo`}
          />
        </div>
        <div
          className={`w-64 h-16 p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-darker-gray  shadow-xl rounded-b-lg`}>
          <p>{appDict[userLanguage].LOADING} </p>
        </div>
      </div>
    </div>
  )
}

export default ComponentLoading;