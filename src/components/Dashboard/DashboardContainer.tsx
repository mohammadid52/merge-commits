import isEmpty from 'lodash/isEmpty';
import React, {useContext} from 'react';
import {getAsset} from '../../assets';
import {GlobalContext} from '../../contexts/GlobalContext';
import HeroBanner from '../Header/HeroBanner';

interface DashboardContainerProps {
  currentPage: string;
  bannerTitle: string;
  bannerImg: string;
  children: any;
}

const DashboardContainer = ({
  currentPage,
  bannerTitle,
  bannerImg,
  children,
}: DashboardContainerProps) => {
  const {state, theme, clientKey} = useContext(GlobalContext);
  const themeColor = getAsset(clientKey, 'themeClassName');

  const user = !isEmpty(state)
    ? {firstName: state.user.firstName, preferredName: state.user.firstName}
    : null;
  const currentUnit = () => {
    if (!isEmpty(state)) {
      const filtered = state.roomData.syllabus?.find(
        (syllabusObj: any) => syllabusObj.active
      );
      if (filtered) {
        return filtered.name;
      } else {
        return null;
      }
    } else {
      return null;
    }
  };

  return (
    <>
      <div className={`flex flex-row`}>
        <div>
          <HeroBanner imgUrl={bannerImg} title={bannerTitle} />
          {user && (
            <div
              className={`${theme.section} -mt-4 2xl:-mt-6 mb-4 px-6 py-2 2xl:py-4 m-auto relative ${theme.backGround[themeColor]} text-white rounded`}>
              <h2 className={`text-sm 2xl:text-xl text-center font-normal`}>
                <span className="font-semibold">{'Classroom Manager'}</span>
              </h2>
            </div>
          )}
          <div className="flex-1 h-full relative z-0 flex">
            <main className="flex-1 relative z-0 focus:outline-none">{children}</main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardContainer;
