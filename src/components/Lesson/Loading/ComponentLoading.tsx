import {getAsset} from 'assets';
import {GlobalContext} from 'contexts/GlobalContext';
import useDictionary from 'customHooks/dictionary';
import gsap from 'gsap';
import React, {useContext, useEffect} from 'react';

const ComponentLoading = () => {
  const {clientKey, userLanguage} = useContext(GlobalContext);
  const {appDict} = useDictionary(clientKey);

  useEffect(() => {
    let tl = gsap.timeline({});
    tl.fromTo(
      '.polka-pattern',
      {
        backgroundPosition: '0%',
        duration: 5,
        ease: 'power1.inOut'
      },
      {backgroundPosition: '100%', duration: 10, ease: 'power1.inOut'}
    );
    return () => {
      tl.kill();
    };
  }, []);

  return (
    <div
      id="component-loading"
      className="min-h-screen h-screen w-full text-gray-200  font-light flex flex-col justify-center items-center">
      <div className="w-auto">
        <div className=" theme-card-shadow rounded-lg">
          <div
            className={`p-8 text-lg text-center text-blue-100 flex flex-col justify-center items-center font-light bg-white rounded-t-lg`}>
            <img src={getAsset(clientKey, 'loading_logo')} alt={`${clientKey} Logo`} />
          </div>
          <div
            className={`  p-4 text-sm text-center text-white flex flex-col justify-center items-center font-light iconoclast:bg-500 curate:bg-500    rounded-b-lg`}>
            <p>{appDict[userLanguage].LOADING} </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentLoading;
